import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AgmGeocoder, MapsAPILoader } from '@agm/core';
import { listenerCount } from 'events';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
})
export class GmapComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 0;
  address: string = '';
  geoCoder: any;
  allPlaces: any[] = [];
  markers: any[] = [];
  bounds: any;

  body: any[] = [];
  county: any;

  @ViewChild('search')
  public searchElementRef!: ElementRef<HTMLInputElement>;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.bounds = true; //bound when true will show all markers
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.allPlaces.push(place);
          this.searchElementRef.nativeElement.value = '';
          this.addMarkers(); //comment this to use single marker

          //Use this for single marker
          // if (
          //   place.geometry === undefined ||
          //   place.geometry === null
          // ) {
          //   return;
          // }
          // this.zoom = 12;
          //   this.latitude = place.geometry.location.lat();
          //   this.longitude =place.geometry.location.lng();
        });
      });
    });
  }

  addMarkers() {
    this.markers = [];
    for (let i = 0; i < this.allPlaces.length; i++) {
      if (
        this.allPlaces[i].geometry === undefined ||
        this.allPlaces[i].geometry === null
      ) {
        return;
      }
      this.zoom = 12;
      this.county = this.allPlaces[i].formatted_address;

      this.markers[i] = {
        latitude: this.allPlaces[i].geometry.location.lat(),
        longitude: this.allPlaces[i].geometry.location.lng(),
      };
      this.getZipcode(
        this.markers[i].latitude,
        this.markers[i].longitude,
        this.county
      );
    }

    if (this.markers.length == 0) {
      this.setCurrentLocation();
    }
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // For static center focus on initialization
        //  this.latitude = 36.778259;
        // this.longitude = -119.417931;

        //bounds here will keep focus on current location.
        this.bounds = new google.maps.LatLngBounds();
        this.bounds.extend(
          new window['google'].maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        );
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: string) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  getZipcode(lat, lng, county): any {
    const latlng = {
      lat,
      lng,
    };
    this.geoCoder.geocode(
      { location: latlng },
      (
        results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus
      ) => {
        if (status === 'OK') {
          if (results[0]) {
            results[0].address_components.forEach((a) => {
              if (a.types.includes('postal_code')) {
                const zipcode = a.long_name;
                const place = {
                  county: county,
                  lat: lat,
                  lng: lng,
                  zipcode: zipcode,
                };
                if (!this.body.some((a) => a.county === county)) {
                  this.body.push(place);
                }
              }
            });
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  removeAdd(add: any) {
    this.allPlaces = this.allPlaces.filter(
      (place) => place.formatted_address != add
    );
    this.body = this.body.filter((place) => place.county != add);
    this.addMarkers();
  }

  onSave(): any {
    if (this.allPlaces.length === 0) {
      console.log('Please select at least one county');
      return;
    } else {
      this.markers = [];
      this.addMarkers();
      const body = {
        datetime: [], // time slot selection will be passed here
        locations: [...this.body],
      };
      console.log('body', body); //pass this to api
    }
  }
}
