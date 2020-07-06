import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IgxTreemapModule, IgxDataChartInteractivityModule } from "igniteui-angular-charts";
import { IgxTreemapComponent } from 'igniteui-angular-charts';
import { MapComponent } from './charts/map/map.component';
import { IgxGeographicMapModule } from 'igniteui-angular-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from "highcharts-angular";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent    
  ],
  imports: [
    IgxTreemapModule,
    IgxGeographicMapModule,
    IgxDataChartInteractivityModule,
    BrowserAnimationsModule,
    BrowserModule,
    HighchartsChartModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
