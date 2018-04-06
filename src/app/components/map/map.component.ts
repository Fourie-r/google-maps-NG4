import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import * as mapConsts from './constants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map') gmapElement: any;
  map: google.maps.Map;

  constructor() { }

  ngOnInit() {
    const mapProps = {
      center: new google.maps.LatLng(53.5511, 9.9937),
      zoom: 12,
      backgroundColor: 'white',
      mapMaker: 'True',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProps);

    const marker = new google.maps.Marker({
      position: {lat: 53.5511, lng: 9.9937 },
      map: this.map,
      label: 'This is how you are supposed to do it',
      title: 'Hey you there motherfucker are u leaning anything'
    });

    const infowindow = new google.maps.InfoWindow({
      content: 'Finally this is how you do it'
    });

    marker.addListener('click', function(){
      infowindow.open(this.map, marker);
    });

    marker.setMap(this.map);

  }

}
