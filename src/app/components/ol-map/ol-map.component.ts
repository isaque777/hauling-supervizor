

import { Component, OnInit } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Extent, getCenter } from 'ol/extent';

import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { environment } from 'src/environments/environment';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { fromLonLat, get } from 'ol/proj';



interface DropdownItem {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements OnInit {
  center: Coordinate = [-483281, 6904172];
  title = 'openLayerMap';
  map: Map | undefined;
  projection: any | undefined;
  extent: Extent | undefined;
  selectedGeometry: any | undefined;
  selectedData: any | undefined;
  selectedIteration: string | undefined;
  raster = new TileLayer({
    source: new OSM(),
  });
  draw: Draw | undefined; // global so we can remove it later

  source = new VectorSource({ wrapX: false });

  vector = new VectorLayer({
    source: this.source,
  });

  geometryTypes: DropdownItem[] = [
    { value: 'Point', viewValue: 'Point' },
    { value: 'LineString', viewValue: 'LineString' },
    { value: 'Polygon', viewValue: 'Polygon' },
    { value: 'Circle', viewValue: 'Circle' },
    { value: 'None', viewValue: 'None' },
  ];

  iterationTypes: DropdownItem[] = [
    { value: 'interaction_type_draw', viewValue: 'Draw' },
    { value: 'interaction_type_modify', viewValue: 'Modify' }
  ];


  dataTypes: DropdownItem[] = [
    { value: 'GeoJSON', viewValue: 'GeoJSON' },
    { value: 'KML', viewValue: 'KML' },
    { value: 'GPX', viewValue: 'GPX' },
  ];

  ngOnInit(): void {

    this.extent = [
      environment.siteExtents.minLong,
      environment.siteExtents.minLat,
      environment.siteExtents.maxLong,
      environment.siteExtents.maxLat,
    ];


    proj4.defs("EPSG:4326", "+proj=tmerc +lat_0=42.859558783333 +lon_0=-111.39915361388 +k_0=1.0 +a=6378137.0000001015 +b=6356752.314200101 +x_0=874.9606299203758 +y_0=9787.440182870307 +towgs84=0.0,0.0,0.0 +units=m +no_defs");
    register(proj4)
    this.projection = get('EPSG:4326')
    // this.projection.setExtent(this.extent);



    // this.map = new Map({
    //   target: "map",
    //   view: new View({
    //     // center: ol.proj.transform([42.83472768, -111.34983345], 'EPSG:4326' , 'EPSG:3857'),
    //     // center: fromLonLat([74.465, 21.467]),
    //     // center: this.center,
    //     layers: [this.raster, this.vector],
    //     center: fromLonLat(getCenter(this.extent), this.projection),
    //     zoom: 15,
    //     projection: this.projection,
    //   }),
    //   layers: [
    //     new Tile({
    //       source: new OSM()
    //     })
    //     , this.vector
    //   ]
    // });


    this.map = new Map({
      layers: [this.raster, this.vector],
      target: 'map',
      view: new View({
        zoom: 10,
        center: fromLonLat(getCenter(this.extent), this.projection),
        projection: this.projection
      }),
    });

    this.addInteraction();

  }


  geometryChanged(value: any) {
    if (this.map) {
      console.log(value);
      if (this.draw) {
        this.map.removeInteraction(this.draw);
      }
      this.addInteraction();
    }
  }

  addInteraction() {
    const value = this.selectedGeometry;
    if (value !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: value,
      });
      if (this.map) {
        this.map.addInteraction(this.draw);
      }
    }
  }

}