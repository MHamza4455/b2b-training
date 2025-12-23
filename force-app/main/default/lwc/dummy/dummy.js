import { LightningElement, api, track } from 'lwc';

export default class StackedProgressBar extends LightningElement {
    // API Properties (Input)
    @api maxCapacity = 10;
    @api mslLoad = 3.90; // MSL Units
    @api smiLoad = 2.50; // SMI Units

    // Tracked properties (Output/Display)
    @track totalLoad;
    @track totalPercent;
    @track emptySpace;

    // Internal properties to store raw percentages
    _mslPercent = 0;
    _smiPercent = 0;

    connectedCallback() {
        this.calculateMetrics();
    }

    calculateMetrics() {
        // Calculations
        this.totalLoad = (this.mslLoad + this.smiLoad).toFixed(2);
        this.emptySpace = (this.maxCapacity - this.totalLoad).toFixed(2);

        // Calculate Percentages
        this._mslPercent = (this.mslLoad / this.maxCapacity) * 100;
        this._smiPercent = (this.smiLoad / this.maxCapacity) * 100;
        this.totalPercent = Math.round((this.totalLoad / this.maxCapacity) * 100);
    }

    // Getter to apply width style for MSL segment
    get mslWidthStyle() {
        // Only return width property
        return `width: ${this._mslPercent}%;`;
    }

    // Getter to apply width style for SMI segment
    get smiWidthStyle() {
        // Only return width property
        return `width: ${this._smiPercent}%;`;
    }
}