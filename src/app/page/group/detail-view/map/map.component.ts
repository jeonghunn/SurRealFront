import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { options } from 'sanitize-html';
import { RoomService } from 'src/app/core/room.service';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
})
export class MapComponent implements OnInit, AfterViewInit {


  private map: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private infowindow: google.maps.InfoWindow;


  public ngOnInit(): void {
    this.initMap();
  }

  public ngAfterViewInit(): void {
   
  }

  
  public initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      zoom: 10,
      center: { lat: 35.871, lng: 128.601 },
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    const initialLatLng = new google.maps.LatLng(35.88979960417728, 128.6101853686389);
    this.makeMarker(initialLatLng);

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

    this.infowindow = new google.maps.InfoWindow({
      content: "<p>Marker Location:" + newMarker.getPosition() + "</p>",
    });
   
    newMarker.addListener("click", () => {
      this.infowindow.open(this.map, newMarker);
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
