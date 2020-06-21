import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IgxTreemapModule, IgxDataChartInteractivityModule } from "igniteui-angular-charts";
import { IgxTreemapComponent } from 'igniteui-angular-charts';
import { TreeMapComponent } from './charts/tree-map/tree-map.component';
import { MapComponent } from './charts/map/map.component';
import { IgxGeographicMapModule } from 'igniteui-angular-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TreeMapComponent,
    MapComponent    
  ],
  imports: [
    IgxTreemapModule,
    IgxGeographicMapModule,
    IgxDataChartInteractivityModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
