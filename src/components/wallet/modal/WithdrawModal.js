import React, { Component } from 'react';
import { Motion, spring } from 'react-motion'
import { timeStampToHR } from './../../utils/secsToHMS'
const {remote} = window.electron;
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')
const {INDICATOR_ID} = dictConfig



export default class WithdrawModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <div className="content__indicator">
                
            </div>
        );
    }
}
