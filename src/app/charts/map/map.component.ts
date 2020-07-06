declare var require: any;

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';
import { ChartDataService } from 'src/app/shared/chart-data.service';

const World = require('@highcharts/map-collection/custom/world-continents.geo.json');
MapModule(Highcharts);
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    Highcharts = Highcharts;
    chartConstructor = "mapChart";
    infoChartConstructor = "chart";
    mapChart;
    continentDetailsChart;
    mapChartCallback;
    continentDetailsCallback;
    updateFromInput = false;
    updateContinentDetails = false;
    data: any = {};
    continentData = [];
    selectedContinents = [];
    selectedContinentsCountries = []
    selectedContinentsData = []
    date = new Date();
    mapChartOptions = {
        chart: {
            map: World
        },
        title: {
            text: 'Total COVID-19 Cases as of ' + this.date.toLocaleDateString()
        },
        subtitle: {
            text: 'Source: <a href="https://thevirustracker.com/api">The Virus Tracker</a>'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox'
            }
        },
        colorAxis: {
            min: 0,
            minColor: '#efecf3',
            maxColor: '#bd1816'
        },
        series: [{
            name: 'Total cases',
            states: {
                hover: {
                    color: '#ba000d'
                },
                select: {
                    color: '#ba000d',
                    borderColor: 'black',
                    dashStyle: 'shortdot'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            allAreas: false,
            data: this.continentData,
            allowPointSelect: true,
            point: {
                events: {
                    select: () => { //Arrow function required to bind to chart component instead of the sub-object
                        this.selectContinent();
                    },
                    unselect: () => {
                        this.selectContinent();
                    }
                }
            }
        }]
    }

    continentDetailsOptions = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Continent breakdown by country'
        },
        // legend: {
        //     layout: 'vertical',
        //     align: 'left',
        //     verticalAlign: 'top',
        //     x: 250,
        //     y: 100,
        //     floating: true,
        //     borderWidth: 1
        // },
        xAxis: {
            categories: this.selectedContinentsCountries, title: {
                text: null
            }
        },
        yAxis: {
            min: 0, title: {
                text: 'Cases', align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: this.selectedContinentsData
    }

    constructor(private chartDataService: ChartDataService,
        private cdRef: ChangeDetectorRef
        ) {
        const self = this;
        this.mapChartCallback = chart => {
            self.mapChart = chart;
            this.updateContinentInformation()
        };
        this.continentDetailsCallback = chart => {
            self.continentDetailsChart = chart;
            this.updateSelectedContinents();
        };
    }

    ngOnInit() {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
      }

    selectContinent() {
        this.selectedContinents = this.mapChart.getSelectedPoints().map(function (e) {
            return e['hc-key'];
        });
        if(typeof this.continentDetailsChart !== "undefined"){
            this.updateSelectedContinents();
        }
    }
    async updateContinentInformation() {
        this.mapChart.showLoading();
        this.data = await this.chartDataService.getChartData();
        this.continentData.splice(0, this.continentData.length);
        for (var prop in this.data.continents) {
            if (Object.prototype.hasOwnProperty.call(this.data.continents, prop)) {
                this.continentData.push([prop, this.data.continents[prop]]);
            }
        };
        this.mapChart.hideLoading();
        this.updateFromInput = true;
        console.log(this.data);
    }

    updateSelectedContinents() {
        this.continentDetailsChart.showLoading();
        let continentData =  this.getTopCountriesByContinents();
        this.selectedContinentsCountries.splice(0, this.selectedContinentsCountries.length);
        this.selectedContinentsData.splice(0, this.selectedContinentsData.length);
        this.selectedContinentsData.push(...continentData.data);
        this.selectedContinentsCountries.push(...continentData.names);
        this.continentDetailsChart.hideLoading();
        this.updateContinentDetails = true;
    }


    //HELPER FUNCTIONS
    getTopCountriesByContinents() {
        let returnData = {names: [], data:[]};

        if(this.selectedContinents.length > 0){
        returnData.data = [{name: "Total Cases", data:[]},{name: "Total Recovered", data:[]},{name: "Total Active Cases", data:[]},{name: "Total Deaths", data:[]}]
        let countryData = this.data.countriesByContinent[this.selectedContinents[0]];
        countryData.sort((a, b) => (a.totalCases < b.totalCases) ? 1 : -1)
        countryData.splice(6,countryData.length);
        countryData.forEach(element => {
            returnData.names.push(element.title);
            returnData.data[0].data.push(element.totalCases)
            returnData.data[1].data.push(element.totalRecovered)
            returnData.data[2].data.push(element.totalActive)
            returnData.data[3].data.push(element.totalDeaths)

        });
        }

        return returnData;
    }
}