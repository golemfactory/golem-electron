import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import ReactTooltip from 'rc-tooltip'
import { timeStampToHR } from './../../utils/secsToHMS'
const {remote} = window.electron;
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')
const {INDICATOR_ID} = dictConfig



export default class CurrencyBox extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {amount, suffix, description} = this.props
        return (
            <div className="content__currency-box">
                <div>
                	<span className="icon-android"/>
                </div>
                <div>
                	<span>{amount}<span className="currency-suffix">{suffix}</span></span>
                	<span>est. 132000.12 $</span>
                </div>
                <ReactTooltip overlayClassName="black" overlay={<p>{description}</p>} placement="bottomRight" trigger={['hover']} align={{
                offset: [12, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                	<span className="icon-question-mark"/>
                </ReactTooltip>
                <button className="btn--outline wallet__btn-withdraw">Withdraw</button>
            </div>
        );
    }
}
