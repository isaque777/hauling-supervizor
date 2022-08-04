import { Component, OnInit } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import { Extent, getCenter } from 'ol/extent';

import Tile from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat, get, get as GetProjection, Projection } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill'
import format from 'ol/format'
import Draw from 'ol/interaction/Draw';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import proj4 from 'proj4';
import { environment } from 'src/environments/environment';



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
  source = new VectorSource();

  vector = new VectorLayer({
    source: this.source, style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
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

  // make draw global so it can later be removed
  draw: any;
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



    this.map = new Map({
      target: "map",
      view: new View({
        // center: ol.proj.transform([42.83472768, -111.34983345], 'EPSG:4326' , 'EPSG:3857'),
        // center: fromLonLat([74.465, 21.467]),
        // center: this.center,
        center: fromLonLat(getCenter(this.extent), this.projection),
        zoom: 15,
        projection: this.projection,
      }),
      layers: [
        new Tile({
          source: new OSM()
        })
        , this.vector
      ]
    });




    // // creat a select to choose geometry type
    // var typeSelect = document.getElementById('geom_type');
    // // rebuild interaction when changed
    // typeSelect.onchange = function (e) {
    //     map.removeInteraction(draw);
    //     addInteraction();
    // };

    // // create a select to choose a data type to save in
    // dataTypeSelect = document.getElementById('data_type');
    // // clear map and rebuild interaction when changed
    // dataTypeSelect.onchange = function (e) {
    //     clearMap();
    //     map.removeInteraction(draw);
    //     addInteraction();
    // };



    // add the interaction when the page is first shown
    // this.addInteraction();


  }


  // //   // add draw interaction
  // addInteraction() {
  //   let geometryType = this.selectedGeometry;
  //   if (geometryType !== 'None') {
  //     this.draw = new Draw({
  //       source: this.source,
  //       type: /** @type {ol.geom.GeometryType} */ (geometryType)
  //     });

  //     // this.draw.on('drawend', function (evt) {
  //     // });
  //     this.saveData();

  //     if (this.map) {
  //       this.map.addInteraction(this.draw);
  //     }
  //   }
  // }

  // saveData() {
  //   let source = this.vector.getSource();
  //   if(source)
  //   let allFeatures = source.getFeatures();
  //   }
  //   let fmt =  format[this.selectedData]();
  //   let data;
  //   try {
  //     data = fmt.writeFeatures(allFeatures);
  //   } catch (e) {
  //     // at time of creation there is an error in the GPX format (18.7.2014)
  //     document.getElementById('data').value = e.name + ": " + e.message;
  //     return;
  //   }
  //   if (dataTypeSelect.value === 'GeoJSON') {
  //     // format is JSON
  //     document.getElementById('data').value = JSON.stringify(data, null, 4);
  //   } else {
  //     // format is XML (GPX or KML)
  //     var serializer = new XMLSerializer();
  //     document.getElementById('data').value = serializer.serializeToString(data);
  //   }
  // }

  // geometryChanged(value: any) {
  //   if (this.map) {
  //     console.log(value);
  //     this.map.removeInteraction(this.draw);
  //     this.addInteraction();
  //   }
  // }

}
