declare var require: any;

import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';

const World = require('@highcharts/map-collection/custom/world-continents.geo.json');
const continentCodes = require('./country-and-continent-codes-list.json');
MapModule(Highcharts);
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
    apiEndpoint = "https://api.thevirustracker.com/free-api?countryTotals=ALL"
    title = "app";
    chart;
    updateFromInput = false;
    Highcharts = Highcharts;
    chartConstructor = "mapChart";
    chartCallback;
    chartOptions = {
        chart: {
            map: World
        },
        title: {
            text: 'Highmaps basic demo'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox'
            }
        },
        colorAxis: {
            min: 0
        },
        series: [{
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            allAreas: false,
            data: [
                ['eu', 0],
                ['oc', 1],
                ['af', 2],
                ['as', 3],
                ['na', 4],
                ['sa', 5]
            ]
        }]
    }

    ngOnInit(){
        
    }
}