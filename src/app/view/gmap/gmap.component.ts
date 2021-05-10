import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AgmGeocoder, MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss']
})
export class GmapComponent implements OnInit {
  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 0;
  address: string = '';
  geoCoder: any;
  allPlaces: any [] =[];
  markers: any[] =[];
//  paths = [
//     { lng: -73.077796936035,  lat: 7.18019914627087 },
//     { lng: -73.0765991210938, lat: 7.17500114440924 },
//     { lng: -73.0805969238281, lat: 7.16109991073608 },
//     { lng: -73.081199645996,  lat: 7.14789915084839 },
//     { lng: -73.0748977661132, lat: 7.13860082626343 },
//     { lng: -73.0655975341797, lat: 7.13280010223394 },
//     { lng: -73.0626983642578, lat: 7.12929916381836 },
//     { lng: -73.0673980712889, lat: 7.1263999938966  },
//     { lng: -73.0759963989258, lat: 7.10970115661621 },
//     { lng: -73.084098815918,  lat: 7.10449981689459 },
//     { lng: -73.0943984985352, lat: 7.09769916534424 },
//     { lng: -73.1088027954102, lat: 7.08269977569586 },
//     { lng: -73.1156997680664, lat: 7.07289981842052 },
//     { lng: -73.1231994628906, lat: 7.07060003280645 },
//     { lng: -73.1300964355469, lat: 7.05680179595953 },
//     { lng: -73.1393966674804, lat: 7.05340003967291 },
//     { lng: -73.1473999023437, lat: 7.05050086975098 },
//     { lng: -73.152099609375,  lat: 7.05919981002808 },
//     { lng: -73.1601028442383, lat: 7.06330013275158 },
//     { lng: -73.1688003540039, lat: 7.06389999389648 },
//     { lng: -73.1802978515624, lat: 7.06629991531383 },
//     { lng: -73.1843032836913, lat: 7.07320117950451 },
//     { lng: -73.1860961914062, lat: 7.08760023117071 },
//     { lng: -73.1884002685546, lat: 7.1096010208131  },
//     { lng: -73.1815032958984, lat: 7.12750101089489 },
//     { lng: -73.1780014038085, lat: 7.15230083465588 },
//     { lng: -73.1781005859374, lat: 7.17660093307501 },
//     { lng: -73.1763000488281, lat: 7.18930006027233 },
//     { lng: -73.1770782470703, lat: 7.19456291198725 },
//     { lng: -73.1682968139647, lat: 7.19389915466314 },
//     { lng: -73.1636962890624, lat: 7.1995987892152  },
//     { lng: -73.1591033935547, lat: 7.20250082016003 },
//     { lng: -73.1452026367187, lat: 7.211100101471   },
//     { lng: -73.1360015869141, lat: 7.21739912033081 },
//     { lng: -73.1261978149414, lat: 7.22079992294312 },
//     { lng: -73.1199035644531, lat: 7.22370100021362 },
//     { lng: -73.1118011474609, lat: 7.2241997718811  },
//     { lng: -73.1078033447265, lat: 7.22540187835699 },
//     { lng: -73.1054992675781, lat: 7.22540187835699 },
//     { lng: -73.1054992675781, lat: 7.22129917144787 },
//     { lng: -73.1048965454102, lat: 7.21269989013683 },
//     { lng: -73.1048965454102, lat: 7.20340108871466 },
//     { lng: -73.1031036376953, lat: 7.19760084152222 },
//     { lng: -73.0973968505859, lat: 7.1911988258363  },
//     { lng: -73.0915985107421, lat: 7.18540000915522 },
//     { lng: -73.0864028930664, lat: 7.18370008468634 },
//     { lng: -73.077796936035,  lat: 7.18019914627087 }
// ];

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.allPlaces.push(place);
          this.addMarkers();
        });
      });
    });
  }

  addMarkers(){
    for(let i=0; i<this.allPlaces.length; i++){
      if (this.allPlaces[i].geometry === undefined || this.allPlaces[i].geometry === null) {
        return;
      }
      this.markers[i]={
        latitude: this.allPlaces[i].geometry.location.lat(),
        longitude: this.allPlaces[i].geometry.location.lng()
      }
      // console.log(this.markers[i])
      this.zoom = 12;
    }
  }
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  
  getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: string) => {
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
  
    });
  }

  removeAdd(add: any){
    // console.log(add)
    this.allPlaces = this.allPlaces.filter(place =>place.formatted_address != add)
    // console.log(this.allPlaces)
    this.addMarkers();
  }

}
