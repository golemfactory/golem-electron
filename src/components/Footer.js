import React, { Component } from "react";
import { hashHistory } from "react-router";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Tooltip from '@tippy.js/react'

import * as Actions from "./../actions";

const status = Object.freeze({
  READY: "Ready",
  NOTREADY: "Not Ready",
  WAITING: "Waiting",
  COMPUTING: "Computing",
  FINISHED: "Finished",
  TIMEOUT: "Timeout"
});

const mapStateToProps = state => ({
  footerInfo: state.realTime.footerInfo,
  psEnabled: state.preview.ps.enabled,
  id: state.preview.ps.id,
  frameCount: state.preview.ps.frameCount
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});
/**
 * { Class for footer component. }
 *
 * @class      Footer (name)
 */
export class Footer extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * [_handlePreviewSwitch onChange function for switch input]
   * @return  {Boolean}   true
   */

  _handlePreviewSwitch = () => {
    const { actions } = this.props;
    const { previewSwitch } = this.refs;
    actions.setPreviewRadio(previewSwitch.checked);
  };

  /**
   * [_handleExpand new-window expand handler]
   * @param  {Number} id         [Task id]
   * @param  {Number} frameCount [Amount of frame]
   */
  _handleExpand(id, frameCount, enabled) {
    id &&
      enabled &&
      this.props.setPreviewExpanded({
        isScreenOpen: true,
        id,
        frameCount
      });
  }

  render() {
    const { preview, footerInfo, id, frameCount, psEnabled } = this.props;
    return (
      <footer className="footer">
        <div className="info-bar__footer">
          <span
            className={`progress-status indicator-status ${
              footerInfo ? "indicator-status--" + footerInfo.color : ""
            }`}
          />
          <span>{footerInfo && footerInfo.message}</span>
        </div>
        <div className="preview-bar__footer">
          <Tooltip content={<p>Preview</p>} placement="bottom" trigger="mouseenter">
            <div className="switch-box switch-box--green">
              <label className="switch">
                <input
                  ref="previewSwitch"
                  type="checkbox"
                  onChange={this._handlePreviewSwitch}
                  defaultChecked={preview}
                  aria-label="Show previews"
                />
                <div className="switch-slider round" />
              </label>
            </div>
          </Tooltip>
          <Tooltip
            content={<p>Preview Window</p>}
            placement="bottom"
            trigger="mouseenter">
            <span
              className={`button__expand icon-new-window ${
                !!id && psEnabled ? "jump" : "disabled"
              }`}
              onClick={this._handleExpand.bind(this, id, frameCount, psEnabled)}
              onKeyDown={event => {
                event.keyCode === 13 &&
                  this._handleExpand.call(this, id, frameCount, psEnabled);
              }}
              role="button"
              aria-label="Open Detailed Preview Window"
              tabIndex="0"
            />
          </Tooltip>
        </div>
      </footer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
