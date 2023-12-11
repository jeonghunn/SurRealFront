import { AfterViewInit, Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @ViewChild('pacInput') pacInput: ElementRef;

  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private currentInfoWindow: google.maps.InfoWindow;
  
  constructor(private renderer: Renderer2) {}
  public ngAfterViewInit(): void {
    this.initMap();
  }

  public initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      zoom: 17,
      center: { lat: 35.88979960417728, lng:128.6101853686389},
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.renderer.appendChild(this.mapContainer.nativeElement, this.pacInput.nativeElement);

    const searchBox = new google.maps.places.SearchBox(this.pacInput.nativeElement);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.pacInput.nativeElement);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });
    let infomarkers: google.maps.Marker[] = [];
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      infomarkers.forEach((marker) => {
        marker.setMap(null);
      });
      infomarkers = [];

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
        }

        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        
        var photos = place.photos;
        

        const infomarker= new google.maps.Marker({
          map: this.map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
        infomarkers.push(infomarker);

        const contentString = `
          <div>
            <p>${place.name}</p>
            <img src="${photos[0].getUrl({maxWidth: 200, maxHeight: 200})}" alt="Place Photo">
            <p>${place.formatted_address}</p>
            
          </div>
        `;

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 300,
        });
        

        infomarker.addListener('click', () => {
          if (this.currentInfoWindow) {
            this.currentInfoWindow.close();
          }
      
          infowindow.open(this.map, infomarker);

          this.currentInfoWindow = infowindow;
        });

        infomarker.addListener('rightclick', () => {
          const savemarker= new google.maps.Marker({
            map: this.map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
          savemarker.addListener('click', () => {
            infowindow.open(this.map, savemarker);
          });
      
          savemarker.addListener('rightclick', () => {
            this.removeMarker(savemarker);
          });
          this.markers.push(savemarker);
        });



        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });

    this.map.addListener('rightclick', (event: google.maps.MapMouseEvent) => {
      this.makeMarker(event.latLng);
    });
  }

  private makeMarker(location: google.maps.LatLng): void {
    const newMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'My Marker',
    });

    this.markers.push(newMarker);

    const infowindow = new google.maps.InfoWindow({
      content: `<p>Marker Location: ${newMarker.getPosition()}</p>`,
      maxWidth: 200,
    });

    newMarker.addListener('click', () => {
      infowindow.open(this.map, newMarker);
    });

    newMarker.addListener('rightclick', () => {
      this.removeMarker(newMarker);
    });
  }

  private removeMarker(marker: google.maps.Marker): void {
    marker.setMap(null);

    const index = this.markers.indexOf(marker);
    if (index !== -1) {
      this.markers.splice(index, 1);
    }
  }
}
