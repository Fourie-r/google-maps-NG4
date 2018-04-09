import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import * as mapConsts from './constants';
import { HttpClient } from 'selenium-webdriver/http';
import { Http, Response } from '@angular/http';
import { IReport } from '../../models/IReport';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild('map') gmapElement: any;
  map: google.maps.Map;
  reports = [];
  reportsObjects = [];
  markers = [];
  GeoReportsMap = new Map();
  geoReportsMap = new Map();
  report: IReport;
  reportCount: number;
  reportCountNew: number;
  latSet = new Set<number>();
  lngSet = new Set<number>();

  constructor(private http: Http) { }

  ngOnInit() {
    const mapProps = {
      center: new google.maps.LatLng(53.5511, 9.9937),
      zoom: 12,
      backgroundColor: 'white',
      mapMaker: 'True',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
     this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProps);

    this.http.get('http://localhost:3000/data').subscribe(data => {
      this.reportsObjects = data.json();
      // console.log(this.reports);

      this.reportsObjects.forEach( report => {
        const [{lat}] = Object.values(report);
        const [{lng}] = Object.values(report);
        const [{reportType}] = Object.values(report);
        const [{shortName}] = Object.values(report);
        // console.log(report);
        const key = `${lat}, ${lng}`;
        let tempResult = this.GeoReportsMap.get(key);
        if (!tempResult) {
          tempResult = [report];
        } else {
          tempResult.push(report);
        }
        this.GeoReportsMap.set(key, tempResult);

    });

    console.log(this.GeoReportsMap);

    this.GeoReportsMap.forEach((value , key: string) => {
     // console.log(value);
     const newArray: IReport[] = Object.values(value[0]);
     // console.log(newArray);
      const marker = new google.maps.Marker({
        position: {lat: newArray[0].lat, lng: newArray[0].lng },
        animation: google.maps.Animation.DROP,
        map: this.map,
          label: {
            text: `${value.length}`,
            color: '#000000',
            fontSize: '12px',
            fontWeight: 'bold'
          }
        // label: 'This is how you are supposed to do it',
        // title: 'Hey you there motherfucker are u leaning anything'
      });
      const reportTypeMap = new Map<string, number>();
      // console.log(newArray);
      value.forEach((val) => {
        console.log(val);
        const valuez: IReport[] = Object.values(val);
        const keyType = valuez[0].reportType;
        let countValue = reportTypeMap.get(keyType);
        if (!countValue) {
            countValue = 1;
        } else {
          countValue++;
        }
        // console.log('count' + countValue);
        reportTypeMap.set(keyType, countValue);
      });
      // console.log(reportTypeMap);
      let infoWindowContent = '';
      reportTypeMap.forEach((val, k) => {
        infoWindowContent += `${k}: ${val}` + '\n';
      });

      const infowindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      marker.addListener('click', function(){
        infowindow.open(this.map, marker);
      });
    });



  });
}
}
