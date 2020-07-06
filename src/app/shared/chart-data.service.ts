import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare var require: any;
const continentCodes = require('./country-and-continent-codes-list.json');

@Injectable({
    providedIn: 'root'
})
export class ChartDataService {
    apiEndPoint = "https://api.thevirustracker.com/free-api?countryTotals=ALL";
    data: any;
    constructor(private http: HttpClient) { }

    public getChartData() {
        if (typeof this.data !== "undefined" && this.data !== null) {
            console.log("cached data!");
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
                                    if(typeof this.data.countriesByContinent[continent] === "undefined"){
                                        this.data.countriesByContinent[continent] =  [];
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
}
