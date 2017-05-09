import React from 'react';

const DEFAULT = "#9b9b9b"
const TRUST = "#37C481"
const WARN = "#FEC62E"
const DANGER = "#F65A23"

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.value
        }
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
        let color = (val < 75 && val > 0) ? TRUST : (val >= 75 && val < 90) ? WARN : (val == 0 ? DEFAULT : DANGER)
        slider.style.background = color;
        slider.style.backgroundImage = [
            '-webkit-gradient(',
            'linear, ',
            'left top, ',
            'right top, ',
            'color-stop(' + value + ', transparent), ',
            'color-stop(' + value + ', #eff1f2)',
            ')'
        ].join('');

        let appWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        indicator.innerHTML = val;
        indicator.style.color = color;
        indicator.style.left = ((parseInt(val) + 20.5) * 3.12) + 'px'; //<-- HARDCODED

    }

    _handleCallback() {
        let slider = document.getElementById('resourceSlider')
        let val = slider.value
        this.props.callback(val)
    }

    render() {
        const {iconLeft, iconRight} = this.props
        const {defaultValue} = this.state
        return (
            <div>
        <div className="slider">
                    <span className={iconLeft}></span>
                    <input type="range" className="slider__resources" id="resourceSlider" defaultValue={defaultValue} min="0" max="100" step="1" list="steplist" onInput={::this._handleFillLower} role="slider" aria-label="Machine's Resource" onMouseUp={::this._handleCallback}/>
                    <span className="slider-indicator__resources" id="resourceSlider__indicator"/>
                    <span className={iconRight}/>
        </div>
      </div>
        );
    }
}
