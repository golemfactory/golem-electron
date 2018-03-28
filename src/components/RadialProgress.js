import React from 'react';

const TRUST = "#37C481"
const WARN = "#FEC62E"
const DANGER = "#F65A23"
const DISABLED = "#CBCBCB"

export default class RadialProgress extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {pct, title, unit, max, warn, disabled, onChange} = this.props
        let maximum = max || 100
        let ratio = ((pct <= maximum ? pct : maximum) / maximum).toFixed(2)
        let color;
        if (!disabled) {
            if (warn) {
                color = (ratio >= 0.75 && ratio < 0.9) ? WARN : ((ratio >= 0.9) ? DANGER : TRUST);
            } else {
                color = TRUST;
            }
        } else {
            color = DISABLED;
        }

        let style = Object.assign({}, null, {
            'strokeDashoffset': 500 - (300 * ratio),
            'stroke': color
        });
        return (
            <div className="radial-options" data-unit={unit}>
                <div className="radial-progress-bar" data-title={title ? title : `${(100 * (pct / maximum)).toFixed(0)}%`}>
                    <svg id="radialSvg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" preserveAspectRatio="xMinYMin meet">
                        <circle r="47.25" cx="52.5" cy="52.5" fill="transparent" strokeDasharray="500" strokeDashoffset="0"></circle>
                        <circle id="bar" r="47.25" cx="52.5" cy="52.5" fill="transparent" strokeDasharray="500" strokeDashoffset="0" style={style}></circle>
                    </svg>
                </div>
                <input type="number" min="1" step="1" max={max} onChange={onChange} value={Math.min(pct, max)} disabled={disabled}/>
            </div>
        );
    }
}