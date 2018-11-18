import React from 'react';

const DEFAULT = "#9b9b9b"
const TRUST = "#37C481"
const WARN = "#FEC62E"
const DANGER = "#F65A23"
const DISABLED = "#CBCBCB"

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.value
        }
    }

    componentDidMount() {
        this._handleFillLower(this.props.disabled)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.disabled !== this.props.disabled) {
            this._handleFillLower(nextProps.disabled)
        }
    }

    /**
     * [_handleFillLower handling colorful part of the input range while thumb dragged]
     */
    _handleFillLower(isDisabled) {
        const primaryColor = this.props.mainColor || TRUST
        const slider = document.getElementById(this.props.inputId);
        const indicator = document.getElementById(`${this.props.inputId}__indicator`);
        if(slider && indicator){       
                const val = slider.value
                const min = slider.getAttribute('min')
                const max = slider.getAttribute('max')
                const value = (val - min) / (max - min);
                const warnValue =  this.props.warnStep ? this.props.warnStep[0] : 75
                const dangerValue = this.props.warnStep ? this.props.warnStep[1] : 90
        
                let color;
                if (!isDisabled) {
                    if (this.props.warn)
                        color = (val < warnValue && val > 0) 
                                    ? primaryColor 
                                    : (val >= warnValue && val < dangerValue) 
                                        ? WARN 
                                        : (val == 0 ? DEFAULT : DANGER);
                    else
                        color = primaryColor;
                        slider.style.cursor = "pointer";
                } else {
                    color = DISABLED;
                    slider.style.cursor = "not-allowed";
                }
        
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
        
                const appWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
                const sliderWidth = slider.getBoundingClientRect().width;
                indicator.innerHTML = val;
                indicator.style.color = color;
                indicator.style.left = (val * ((sliderWidth - 32 )/(max)) + ((((appWidth - sliderWidth)/ 2) + 6))) - (this.props.transform ? 24 : 0) + 'px';
        } 
    }

    /**
     * [_handleCallback func. sends slider value as callback]
     * @return {[type]} [description]
     */
    _handleCallback() {
        const slider = document.getElementById(this.props.inputId)
        const val = slider.value
        this.props.callback(val)
    }

    render() {
        const {iconLeft, iconRight, textLeft, textRight, mainColor, min, max, step, disabled} = this.props
        const {defaultValue} = this.state
        return (
            <div>
                <div className="slider">
                    {iconLeft 
                        ? <span className={`slider-icon ${iconLeft}`}/>
                        : (textLeft ? <span className="slider-text--left">{textLeft}</span> : "")
                    }
                    <input 
                        ref={this.props.inputId} 
                        type="range" 
                        className="slider__resources" 
                        id={this.props.inputId} 
                        defaultValue={(typeof defaultValue === 'number' && defaultValue !== NaN) ? defaultValue : 0} 
                        min={min || 0} 
                        max={max || 100} 
                        step={step || 1} 
                        list="steplist" 
                        onInput={this._handleFillLower.bind(this, disabled)} 
                        role="slider" 
                        aria-label="Machine's Resource" 
                        onMouseUp={::this._handleCallback} 
                        disabled={disabled}/>
                    <span className="slider-indicator__resources" id={`${this.props.inputId}__indicator`}/>
                    {iconRight 
                        ? <span className={`slider-icon ${iconRight}`}/>
                        : (textRight ? <span className="slider-text--right">{textRight}</span> : "")
                    }
                </div>
            </div>
        );
    }
}
