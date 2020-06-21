import { Component, ViewChild } from "@angular/core";
import { IgxTreemapComponent } from "igniteui-angular-charts";
import { TreemapFillScaleMode } from "igniteui-angular-charts";
import { TreemapLayoutType } from "igniteui-angular-charts";
import { TreemapOrientation } from "igniteui-angular-charts";
import { TreeMapDataService } from "./tree-map-data-service";

@Component({
  selector: 'app-tree-map',
  templateUrl: './tree-map.component.html',
  styleUrls: ['./tree-map.component.css']
})
export class TreeMapComponent {
    @ViewChild("treeMap", { static: true })
    public treeMap: IgxTreemapComponent = null;

    public data: any[];

    public ngAfterViewInit(): void {
        this.data = TreeMapDataService.getPopulation();
        this.treeMap.fillScaleMode = TreemapFillScaleMode.Value;
        this.treeMap.fillScaleMinimumValue = 0;
        this.treeMap.fillScaleMaximumValue = 500000;
        this.treeMap.fillScaleMinimumValue = 0;
        this.treeMap.fillScaleMaximumValue = 1500000000; // 1.5B
        this.treeMap.fillBrushes = "#4e62cf #8a58d6" as any;
        this.treeMap.isFillScaleLogarithmic = false;
        this.treeMap.dataSource = this.data;
        this.onClickSquared();
    }

    public onClickSquared(): void {
        this.treeMap.layoutType = TreemapLayoutType.Squarified;
    }

    public onClickSliceVer(): void {
        this.treeMap.layoutType = TreemapLayoutType.SliceAndDice;
        this.treeMap.layoutOrientation = TreemapOrientation.Vertical;
    }
    public onClickSliceHor(): void {
        this.treeMap.layoutType = TreemapLayoutType.SliceAndDice;
        this.treeMap.layoutOrientation = TreemapOrientation.Horizontal;
    }

    public onClickStripVer(): void {
        this.treeMap.layoutType = TreemapLayoutType.Stripped;
        this.treeMap.layoutOrientation = TreemapOrientation.Vertical;
    }
    public onClickStripHor(): void {
        this.treeMap.layoutType = TreemapLayoutType.Stripped;
        this.treeMap.layoutOrientation = TreemapOrientation.Horizontal;
    }

}
