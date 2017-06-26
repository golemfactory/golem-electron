import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../actions'

const status = Object.freeze({
    READY: 'Ready',
    NOTREADY: 'Not Ready',
    WAITING: 'Waiting',
    COMPUTING: 'Computing',
    FINISHED: 'Finished',
    TIMEOUT: 'Timeout'
})

const mapStateToProps = state => ({
    footerInfo: state.realTime.footerInfo
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})
/**
 * { Class for footer component. }
 *
 * @class      Footer (name)
 */
export class Footer extends Component {
    constructor(props) {
        super(props)
    }

    /**
     * [_handlePreviewSwitch onChange function for switch input]
     * @return  {Boolean}   true
     */

    _handlePreviewSwitch() {
        const {actions} = this.props
        const {previewSwitch} = this.refs
        actions.setPreviewRadio(previewSwitch.checked)
    }

    render() {
        const {preview, footerInfo} = this.props
        return (
            <footer className="footer">
              <div className="info-bar__footer">
                <span className={`progress-status indicator-status ${footerInfo ? 'indicator-status--' + footerInfo.color : ''}`}/>
                <span>{footerInfo && footerInfo.message}</span>
              </div>
              <div className="switch-box">
                <label className="switch">
                      <input ref="previewSwitch" type="checkbox" onChange={::this._handlePreviewSwitch} defaultChecked={preview} aria-label="Show previews"/>
                      <div className="switch-slider round"></div>
                </label>
                <span className="switch__desc">Preview</span>
              </div>
            </footer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)