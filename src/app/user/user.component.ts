import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';
import {JourneyOverview} from '../models/journey-overview';
import {ActivatedRoute} from '@angular/router';
import {latLng, Map, polyline, tileLayer} from 'leaflet';
import {environment} from '../../environments/environment';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public displayedColumns: string[] = ['index', 'date', 'startTime', 'endTime'];
  public journeysData = new JourneysDataSource(this.api, this.router);
  constructor(private api: ApiService, private router: ActivatedRoute) {}
  // protected map: Map;

  protected markers: any;
  private latLonNormal: any = [];
  private matchedRoute: any = [];
  protected routes: any = [];
  public layersControl = {
    baseLayers: {
      'Mapbox Streets Map': tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + environment.mapbox_access_token, { maxZoom: 19, detectRetina: true, attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      'Mapbox Light Map': tileLayer('https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=' + environment.mapbox_access_token, { maxZoom: 19, detectRetina: true, attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      'Mapbox Dark Map': tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=' + environment.mapbox_access_token, { maxZoom: 19, detectRetina: true, attribution: '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
    }
  };

  public options = {
    layers: [this.layersControl.baseLayers['Mapbox Streets Map']],
    zoom: 17,
    center: latLng(54.011901, -2.785251)
  };
  public layers = [];
  public layerBounds: any = [];
  public fitBounds;

  selectedRowIndex = -1;
  protected highlight(row) {
    this.selectedRowIndex = row.id;
  }

  ngOnInit() {}

  // onMapReady(map: Map) {
  //   this.map = map;
  // }

  protected updateMap(id) {
    this.clearMap();
    this.getUserJourney(localStorage.getItem('id'), id);
  }

  private clearMap() {
    this.latLonNormal = [];
    this.routes = [];
    this.layers = [];
    this.layerBounds = [];
    this.matchedRoute = [];
  }

  private getUserJourney(userId: string, journeyId: number) {
    this.api.getUserJourney(userId, journeyId).subscribe(res => {
      this.markers = res;

      for (let i = 0; i < this.markers.length; i++) {

        // this.latLonNormal.push([parseFloat(this.markers[i].latitude), parseFloat(this.markers[i].longitude)]);
        if (i < this.markers.length - 1) {
          if (parseInt(this.markers[i].leg, 10) === parseInt(this.markers[i + 1].leg, 10)) {
            // we're on the same part of the journey
            this.latLonNormal.push([ parseFloat(this.markers[i].latitude), parseFloat(this.markers[i].longitude) ]);
          } else {
            // first we save the last point to the prev array
            this.latLonNormal.push([ parseFloat(this.markers[i].latitude), parseFloat(this.markers[i].longitude) ]);

            // we now save this array to the layers' array
            this.routes.push ([parseInt(this.markers[i].action, 10), this.latLonNormal]);

            // now we clear the latLon array
            this.latLonNormal = [];

            // and we save the last point
            this.latLonNormal.push([ parseFloat(this.markers[i].latitude), parseFloat(this.markers[i].longitude) ]);
          }
        } else {
          this.latLonNormal.push([ parseFloat(this.markers[i].latitude), parseFloat(this.markers[i].longitude) ]);
          this.routes.push ([parseInt(this.markers[i].action, 10), this.latLonNormal]);
        }
        this.layerBounds.push(this.latLonNormal);
      }

      for (const index in this.routes) {
        if (this.routes.hasOwnProperty(index)) {
          switch (parseInt(this.routes[index][0], 10)) {
            case 0:
              this.layers.push(polyline(this.routes[index][1], {color: '#0a33ad', weight: 5}));
              break;
            case 1:
              this.layers.push(polyline(this.routes[index][1], {color: '#087423', weight: 5}));
              break;
            case 2:
              this.layers.push(polyline(this.routes[index][1], {color: '#ad2d09', weight: 5}));
              break;
            default:
              this.layers.push(polyline(this.routes[index][1], {color: '#0a33ad', weight: 5}));
          }
        }
      }
      this.fitBounds = polyline(this.layerBounds).getBounds();
    });
  }
}

export class JourneysDataSource extends DataSource<any> {
  private id: any;
  constructor(private api: ApiService, private router: ActivatedRoute) {
    super();
    this.router.params.subscribe(params => {
      this.id = params.id;
    });
  }
  connect(): Observable<JourneyOverview[]> {
    return this.api.getUserJourneys(this.id);
  }
  disconnect() {}
}
