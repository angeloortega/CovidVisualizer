import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var require: any;
const continentCodes = require('./country-and-continent-codes-list.json');
const countryCodes = require('./country-name-and-code-list.json');

@Injectable({
    providedIn: 'root'
})
export class ChartDataService {
    apiEndPoint = "https://api.thevirustracker.com/free-api?countryTotals=ALL";
    apiCountryEndPoint = "https://api.thevirustracker.com/free-api?countryTimeline=";
    data: any;
    constructor(private http: HttpClient) { }

    public getChartData() {
        if (typeof this.data !== "undefined" && this.data !== null) {
            return this.data;
        }
        this.data = {}
        this.data.countries = {};
        this.data.continents = {};
        this.data.countriesByContinent = {};

        let promise = new Promise((resolve, reject) => {
            this.http.get(this.apiEndPoint)
                .toPromise()
                .then(
                    (result: any) => {
                        for (var prop in result.countryitems[0]) {
                            if (Object.prototype.hasOwnProperty.call(result.countryitems[0], prop)) {
                                var country = result.countryitems[0][prop];
                                this.data.countries[country.code] = {
                                    code: country.code,
                                    title: country.title,
                                    totalActive: country.total_cases - (country.total_deaths + country.total_recovered),
                                    totalCases: country.total_cases,
                                    totalDeaths: country.total_deaths,
                                    totalRecovered: country.total_recovered,
                                    totalNewCases: country.total_new_cases_today,
                                    totalNewDeaths: country.total_new_deaths_today,
                                }
                                var continent = continentCodes[country.code];
                                if (typeof continent !== "undefined") {
                                    this.data.continents[continent] = (~~this.data.continents[continent] + country.total_cases);
                                    if (typeof this.data.countriesByContinent[continent] === "undefined") {
                                        this.data.countriesByContinent[continent] = [];
                                    }
                                    this.data.countriesByContinent[continent].push(this.data.countries[country.code]);
                                }
                            }
                        };
                        resolve(this.data);
                    },
                    msg => { // Error
                        reject(msg);
                    }
                );
        });
        return promise;
    }

    public getCountryData(countryName) {
        let dateData = [
            {
                color: "#d2222d", name: "Total Cases", data: [], type: 'line'
            },
            { color: "#2eb42e", name: "Total Recovered", data: [], type: 'line' },
            { color: "#ffbf00", name: "Total Active Cases", data: [], type: 'line' },
            { color: "#0d0d0d", name: "Total Deaths", data: [], type: 'line' }];
        let promise = new Promise((resolve, reject) => {
            this.http.get(this.apiCountryEndPoint + countryCodes[countryName])
                .toPromise()
                .then(
                    (result: any) => {
                        for (var prop in result.timelineitems[0]) {
                            if (Object.prototype.hasOwnProperty.call(result.timelineitems[0], prop)) {
                                let currentDate = new Date(prop);
                                let utcDate = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())

                                var currentDateData = result.timelineitems[0][prop];
                                //Total cases
                                dateData[0].data.push([
                                    utcDate,
                                    currentDateData.total_cases 
                                ]);
                                //Total recovered
                                dateData[1].data.push([
                                    utcDate,
                                    currentDateData.total_recoveries
                                ]);
                                //Total active
                                dateData[2].data.push([
                                    utcDate,
                                    (currentDateData.total_cases - (currentDateData.total_deaths + currentDateData.total_recoveries))
                                ]);
                                //Total deaths
                                dateData[3].data.push([
                                    utcDate,
                                    currentDateData.total_deaths
                                ]);
                            }
                        };
                        resolve(dateData);
                    },
                    msg => { // Error
                        reject(msg);
                    }
                );
        });
        return promise;

    }
}
