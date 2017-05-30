import React, { Component } from 'react'
import { browserHistory } from 'react-router'
/**
 * { Class for footer component. }
 *
 * @class      Footer (name)
 */
export default class Footer extends Component {
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
        const {preview} = this.props
        return (
            <footer className="footer">
              <div>
                <span className="icon-progress"></span>
                <span>Processing your task</span>
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