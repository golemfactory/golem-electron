import React from 'react';

const TRUST = "#37C481"
const WARN = "#FEC62E"
const DANGER = "#F65A23"

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._handleFillLower()
    }

    /**
     * [_handleFillLower handling colorful part of the input range while thumb dragged]
     */
    _handleFillLower() {
        let slider = document.getElementById('resourceSlider')
        let indicator = document.getElementById('resourceSlider__indicator')
        let val = slider.value
        let min = slider.getAttribute('min')
        let max = slider.getAttribute('max')
        var value = (val - min) / (max - min);
        let color = val < 75 ? TRUST : (val >= 75 && val < 90) ? WARN : DANGER
        slider.style.background = color;
        slider.style.backgroundImage = [
            '-webkit-gradient(',
            'linear, ',
            'left top, ',
            'right top, ',
            'color-stop(' + value + ', transparent), ',
            'color-stop(' + value + ', #bbb)',
            ')'
        ].join('');

        let appWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        indicator.innerHTML = val;
        indicator.style.color = color;
        indicator.style.left = ((parseInt(val) + 20.5) * 3.12) + 'px'; //<-- HARDCODED
    }

    render() {
        const {value, iconLeft, iconRight} = this.props
        return (
            <div>
        <div className="slider">
                    <span className={iconLeft}></span>
                    <input type="range" className="slider__resources" id="resourceSlider" defaultValue={value} min="0" max="100" step="1" list="steplist" onInput={::this._handleFillLower}/>
                    <span className="slider-indicator__resources" id="resourceSlider__indicator"/>
                    <span className={iconRight}/>
        </div>
      </div>
        );
    }
}
