import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
  import {
    catchError,
    delayWhen,
    retryWhen,
    take,
    tap,
    throwError,
    timer,
  } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { RoomService } from 'src/app/core/room.service';
import {
  Marker,
  CommunicationResult,
  CommunicationType,
  SpaceItem,
} from 'src/app/model/type';
import {
  Loader,
  LoaderOptions,
} from 'google-maps';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: false
})
export class MapComponent implements OnInit, OnDestroy {
  @Input()
  public groupId: number = null;

  @Input()
  public roomId: number = null;

  @Input()
  public spaceKey: string = null;

  

  public mapOptions: LoaderOptions = {
    libraries: ['places'],
  };
  public loader: Loader = new Loader(environment.mapApiKey, this.mapOptions);
  public google: any = null;


  public space: any = null;
  public map: google.maps.Map;
  public markers: google.maps.Marker[] = [];
  public currentInfoWindow: google.maps.InfoWindow;
  public title: string = null;
  public content: Marker[] = [];
  public data: SpaceItem[] = [];
  public isConnected: boolean = false;
  public reconnectDelay: number = 5000;
  public isAuthenticated: boolean = false;
  public reAuthDelay: number = 100;
  public isAllowEdit: boolean = false;

  public subscriptions: any = [];
  public updateTimerSubscription: any = null;
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @ViewChild('pacInput') pacInput: ElementRef;
  public constructor(
    private dataService: DataService,
    private roomService: RoomService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.loader.load().then((google) => {
      this.google = google;
      this.initMap();
    });
  }

  public init(): void {

  }
  
  public ngOnInit(): void {
    this.roomService.initSpaceWebSocket(this.roomId, this.spaceKey);
    this.subscriptions = [
      this.roomService.spaceWebSocketSubject$.pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(val => this.onConnectionError(val)),
            delayWhen(val => timer(this.reconnectDelay)),
          ),
        ),
      ).subscribe(
        (msg: any) => this.onMessageReceived(msg),
        (err) => this.onConnectionError(err),
        () => this.onConnectionComplete(),
      ),
    ];
  }

  public ngOnDestroy(): void {
    this.roomService.closeSpaceWebSocket();
  }

  public initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      zoom: 17,
      center: { lat: 35.88979960417728, lng:128.6101853686389},
    };

    this.map = new this.google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    const searchBox = new this.google.maps.places.SearchBox(this.pacInput.nativeElement);
    this.map.controls[this.google.maps.ControlPosition.TOP_CENTER].push(this.pacInput.nativeElement);

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

      const bounds = new this.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
        }

        const icon = {
          url: place.icon as string,
          size: new this.google.maps.Size(71, 71),
          origin: new this.google.maps.Point(0, 0),
          anchor: new this.google.maps.Point(17, 34),
          scaledSize: new this.google.maps.Size(25, 25),
        };
        
        var photos = place.photos;
        

        const infomarker= new this.google.maps.Marker({
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

        const infowindow = new this.google.maps.InfoWindow({
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

        infomarker.addListener('dbclick', () => {
          const savemarker= new this.google.maps.Marker({
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

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      this.makeMarker(event.latLng);
    });
  }

  private makeMarker(location: google.maps.LatLng): void {
    const newMarker = new this.google.maps.Marker({
      position: location,
      map: this.map,
      title: 'My Marker',
    });

    this.markers.push(newMarker);
    this.updateLazy();
    const infowindow = new this.google.maps.InfoWindow({
      content: `<p>Marker Location: ${newMarker.getTitle()}</p>`,
      maxWidth: 200,
    });

    newMarker.addListener('click', () => {
      infowindow.open(this.map, newMarker);
    });

    newMarker.addListener('rightclick', () => {
      this.removeMarker(newMarker);
    });
  }
  private loadMarkers(markers: Marker[]) {
    markers.map(marker => {
      const newMarker = new this.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: this.map,
        title: marker.title,
      });
  
      this.markers.push(newMarker);
  
      const infowindow = new this.google.maps.InfoWindow({
        content: `<p>${newMarker.getTitle()}</p>`,
        maxWidth: 200,
      });
  
      newMarker.addListener('click', () => {
        infowindow.open(this.map, newMarker);
      });
  
      newMarker.addListener('rightclick', () => {
        this.removeMarker(newMarker);
      });
    });
  }
  

  private removeMarker(marker: google.maps.Marker): void {
    marker.setMap(null);

    const index = this.markers.indexOf(marker);
    if (index !== -1) {
      this.markers.splice(index, 1);
    }
    this.updateLazy();
  }
  public onMessageReceived(msg: any): void {

    switch (msg.T) {
      case CommunicationType.AUTH:
        const authResult: CommunicationResult = msg as CommunicationResult;
        this.roomService.onAuthResultReceived(authResult.result);
      case CommunicationType.LIVE:
        const version: number = parseInt(msg.content || 0);
        
        if (version <= this.space?.version) {
          return;
        }

        this.load();

        break;
    }
  }


  public load(): void {
    this.dataService.getSpace(this.groupId, this.roomId, this.spaceKey).subscribe((space) => {
      if (space.updatedAt === this.space?.updatedAt) {
        return;
      }

      this.space = space;
      this.title = space.title;
      this.content = space.content ? JSON.parse(space.content) : [];
      this.loadMarkers(this.content);
     });
  }

  public update(): void {
    this.mapping();

    this.dataService.updateSpace(
      this.space?.key,
      this.groupId,
      this.roomId,
      this.title,
      JSON.stringify(this.content),
      this.space?.version,
      ).pipe(
        take(1),
        catchError((err) => {
         if (err?.status === 406) {
          this.load();
        }
        return throwError(err);
      }),
      ).subscribe((space) => {
      this.space = space;
      });
    }

    public updateLazy(): void {
      if (this.updateTimerSubscription){
        this.updateTimerSubscription.unsubscribe();
      }
  
      this.updateTimerSubscription = timer(1000).pipe(take(1)).subscribe(() => {
        this.update();
      });
    }
  public mapping(): void{
    this.content=this.markers.map((item: any) => {
      const position = item.getPosition();
      let lat:number = position.lat();
      let lng:number = position.lng();
      const result: Marker = new Marker(item.getTitle(),lat,lng);
      return result;
    });
  }

  public onConnectionError(error: any = null): void {
    console.log('ConnectionError', error);
    this.isConnected = false;
  }

  public onConnectionComplete(): void {
    this.isAllowEdit = true;
    this.changeDetectorRef.markForCheck();

    if (!this.isConnected) {
      this.load();
    }
  }
}
