declare var require: any;

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
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
    countryChartConstructor = "chart";
    mapChart;
    continentDetailsChart;
    countryDetailsChart;
    mapChartCallback;
    continentDetailsCallback;
    countryDetailsCallback;
    updateFromInput = false;
    updateContinentDetails = false;
    updateCountryDetails = false;
    data: any = {};
    continentData = [];
    selectedContinents = [];
    selectedContinentsCountries = []
    selectedContinentsData = [];
    selectedCountry = "";
    selectedCountryData = [];
    date = new Date();
    mapChartOptions = {
        chart: {
            map: World
        },
        title: {
            text: 'Total COVID-19 Cases as of ' + this.date.toLocaleDateString() + " by Continent"
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
        title: {
            text: 'Continent COVID-19 Cases Breakdown by Country'
        },
        xAxis: {
            categories: this.selectedContinentsCountries,
            title: {
                text: null
            },
            type: 'category',
            min: 0,
            max: 5,
            scrollbar: {
                enabled: true
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
                },
                allowPointSelect: true,
                point: {
                    events: {
                        select: () => { //Arrow function required to bind to chart component instead of the sub-object
                            this.selectCountry();
                        },
                        unselect: () => {
                            this.selectCountry();
                        }
                    }
                },
                states: {
                    inactive: {
                        enabled: false
                    },
                    hover: {
                        color: '#ddd'
                    }
                }
            }
        },
        credits: {
            enabled: false
        },

        series: this.selectedContinentsData
    }

    countryDetailsOptions = {
        title: {
            text: 'Country COVID-19 Cases Breakdown by Date'
        },
        subtitle: {
            text: this.selectedCountry
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            type: 'logarithmic',
            title: {
                text: 'Cases'
            },
            min: 1
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.0f}'
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },
        series: this.selectedCountryData
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
        this.countryDetailsCallback = chart => {
            self.countryDetailsChart = chart;
            this.updateSelectedCountry();
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
        if (typeof this.continentDetailsChart !== "undefined") {
            this.updateSelectedContinents();
            this.selectedCountry = "";
            //this.updateSelectedCountry();
        }
    }
    selectCountry() {
        let countries = this.continentDetailsChart.getSelectedPoints();

        if (countries.length > 0) {
            this.selectedCountry = countries[0].category;
            this.updateSelectedCountry();
        } else {
            this.selectedCountry = "";
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
    }

    updateSelectedContinents() {
        if (this.continentDetailsChart) {
            this.continentDetailsChart.showLoading();
            let continentData = this.getCountriesByContinent();
            this.selectedContinentsCountries.splice(0, this.selectedContinentsCountries.length);
            this.selectedContinentsData.splice(0, this.selectedContinentsData.length);
            this.selectedContinentsData.push(...continentData.data);
            this.selectedContinentsCountries.push(...continentData.names);
            this.continentDetailsChart.hideLoading();
            this.updateContinentDetails = true;
        }
    }

    async updateSelectedCountry() {
        if (this.countryDetailsChart) {
            this.countryDetailsChart.showLoading();
            let countryData: any = await this.chartDataService.getCountryData(this.selectedCountry);
            this.selectedCountryData.splice(0, this.selectedCountryData.length);
            this.selectedCountryData.push(...countryData);
            this.countryDetailsChart.hideLoading();
            this.updateCountryDetails = true;
        }
    }

    //HELPER FUNCTIONS
    getCountriesByContinent() {
        let returnData = { names: [], data: [] };

        if (this.selectedContinents.length > 0) {
            returnData.data = [
                {
                    color: "#d2222d", name: "Total Cases", data: [], type: 'bar'
                },
                { color: "#2eb42e", name: "Total Recovered", data: [], type: 'bar' },
                { color: "#ffbf00", name: "Total Active Cases", data: [], type: 'bar' },
                { color: "#0d0d0d", name: "Total Deaths", data: [], type: 'bar' }]
            let countryData = this.data.countriesByContinent[this.selectedContinents[0]];
            countryData.sort((a, b) => (a.totalCases < b.totalCases) ? 1 : -1)
            // countryData.splice(6,countryData.length);
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