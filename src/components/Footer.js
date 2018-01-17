import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

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
    footerInfo: state.realTime.footerInfo,
    psEnabled: state.preview.ps.enabled,
    id: state.preview.ps.id,
    frameCount: state.preview.ps.frameCount
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

    /**
     * [_handleExpand new-window expand handler]
     * @param  {Number} id         [Task id]
     * @param  {Number} frameCount [Amount of frame]
     */
    _handleExpand(id, frameCount, enabled) {
        (id && enabled) && this.props.setPreviewExpanded({
            isScreenOpen: true,
            id,
            frameCount
        })
    }

    render() {
        const {preview, footerInfo, id, frameCount, psEnabled} = this.props
        return (
            <footer className="footer">
              <div className="info-bar__footer">
                <span className={`progress-status indicator-status ${footerInfo ? 'indicator-status--' + footerInfo.color : ''}`}/>
                <span>{footerInfo && footerInfo.message}</span>
              </div>
              <div className="preview-bar__footer">
              <ReactTooltip overlayClassName="black" placement="topRight" trigger={['hover']} overlay={<p>Preview</p>} mouseEnterDelay={1} align={{
                offset: [0, -13],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>

              <div className="switch-box switch-box--green">
                <label className="switch">
                      <input ref="previewSwitch" type="checkbox" onChange={::this._handlePreviewSwitch} defaultChecked={preview} aria-label="Show previews"/>
                      <div className="switch-slider round"></div>
                </label>
              </div>
                </ReactTooltip>
                <ReactTooltip overlayClassName="black" placement="topRight" trigger={['hover']} overlay={<p>Preview Window</p>} mouseEnterDelay={1} align={{
                offset: [10, -7],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                    <span className={`button__expand icon-new-window ${(!!id && psEnabled) ? 'jump' : 'disabled'}` } onClick={this._handleExpand.bind(this, id, frameCount, psEnabled)} onKeyDown={(event) => {
                event.keyCode === 13 && this._handleExpand.call(this, id, frameCount, psEnabled)
            }} role="button" aria-label="Open Detailed Preview Window" tabIndex="0"></span>
                                </ReactTooltip>
                                </div>
            </footer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)