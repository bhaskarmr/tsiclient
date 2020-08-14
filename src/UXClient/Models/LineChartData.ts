import {Utils} from "./../Utils";
import * as d3 from 'd3';
import {ChartComponentData} from "./ChartComponentData";

class LineChartData extends ChartComponentData {
    public timeMap: any = {};


    public setTimeMap () {
        this.timeMap = this.allValues.reduce ((timeMap, currVal) => {
            var millis = currVal.dateTime.valueOf();
            if (currVal.bucketSize != undefined) {
                millis += (currVal.bucketSize / 2);
            }
            if (currVal.measures != null) {
                if (timeMap[millis] == undefined) {
                    timeMap[millis] = [currVal];
                } else {
                    timeMap[millis].push(currVal);
                }    
            }
            return timeMap;
        }, {});
    }

	constructor(){
        super();
    }

    public mergeDataToDisplayStateAndTimeArrays (data, aggregateExpressionOptions = null) {
        super.mergeDataToDisplayStateAndTimeArrays(data, aggregateExpressionOptions);
        
        // If custom Y extent is set, filter out overflow
        aggregateExpressionOptions.forEach(agg => {
            if(agg.yExtent && agg.clipOutsideYExtent){
                this.filterYOverflow(agg.aggKey, agg.yExtent)
            }
        });
    }

    private filterYOverflow(aggKey, yExtent){
        if(aggKey in this.timeArrays && "" in this.timeArrays[aggKey]){
            this.timeArrays[aggKey][""] = this.timeArrays[aggKey][""].filter(datum => {
                let value = datum.measures[this.getVisibleMeasure(aggKey, "")];
                return value >= yExtent[0] && value <= yExtent[1]
            })
        }
    }
}
export {LineChartData}
