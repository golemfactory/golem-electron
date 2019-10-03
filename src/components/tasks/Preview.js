import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Waveform from 'react-audio-waveform';

import ReactAudioPlayer from 'react-audio-player';

import * as Actions from '../../actions';

import golemIcon from '../../assets/img/preview-thumb.svg';

const mapStateToProps = state => ({
    taskList: state.realTime.taskList,
    frameCount: state.preview.ps.frameCount
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const TEST_PEAKS = [
    0.04,
    0.99,
    0.54,
    0.74,
    0.76,
    0.52,
    0.79,
    0.72,
    0.83,
    0.67,
    0.88,
    0.99,
    0.95,
    0.9399999999999999,
    0.91,
    0.82,
    0.96,
    0.91,
    0.93,
    0.93,
    0.98,
    0.99,
    0.98,
    0.99,
    0.98,
    0.98,
    0.98,
    0.98,
    0.98,
    0.98,
    0.98,
    0.85,
    0.82,
    0.96,
    0.99,
    0.99,
    0.99,
    0.97,
    0.97,
    0.98,
    1,
    0.98,
    0.98,
    0.98,
    0.98,
    0.99,
    0.99,
    0.98,
    0.98,
    0.98,
    0.99,
    0.98,
    0.99,
    0.99,
    0.98,
    0.99,
    0.9,
    0.8,
    0.91,
    0.9,
    0.88,
    0.97,
    0.98,
    0.92,
    0.98,
    0.98,
    0.99,
    0.99,
    0.98,
    0.99,
    0.99,
    0.98,
    0.98,
    0.97,
    0.98,
    0.98,
    0.98,
    0.99,
    0.99,
    0.98,
    0.99,
    0.98,
    0.99,
    0.99,
    0.98,
    0.99,
    0.98,
    0.98,
    0.99,
    0.99,
    0.98,
    0.99,
    0.99,
    1,
    0.99,
    0.93,
    0.96,
    0.83,
    0.9399999999999999,
    0.98,
    0
];

export class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewSRC: null,
            post: 0
        };
    }

    _handleExpand(id, frameCount) {
        id &&
            this.props.actions.setPreviewExpanded({
                isScreenOpen: true,
                id,
                frameCount
            });
    }

    handleClick = secs => {
        this.setState({
            pos: secs
        });
    };

    render() {
        const { id, frameCount, src, taskList, progress, showIf } = this.props;
        let task = !!id && taskList.filter(item => item.id === id)[0];
        let preview = !!task && task.preview;
        const { previewSRC } = this.state;
        return (
            <Fragment>
                {false ? (
                    <div className="section__preview-black">
                        <div className="details__preview">
                            <button
                                className="btn btn--details"
                                onClick={
                                    progress > 0
                                        ? this._handleExpand.bind(
                                              this,
                                              id,
                                              frameCount
                                          )
                                        : undefined
                                }
                                disabled={progress == 0}>
                                Detail view
                            </button>
                        </div>
                        <img
                            className="preview__img"
                            src={
                                src
                                    ? `file://${preview}?${new Date().getTime()}`
                                    : 'error'
                            }
                            alt="Task Preview"
                            ref={img => (this.img = img)}
                            onError={e => {
                                e.preventDefault();
                                return (this.img.src = golemIcon);
                            }}
                        />
                    </div>
                ) : (
                    <div>
                        <Waveform
                            barWidth={4}
                            peaks={TEST_PEAKS}
                            pos={this.state.pos}
                            height={50}
                            duration={210}
                            onClick={this.handleClick}
                            color="#676767"
                            progressGradientColors={[[0, '#888'], [1, '#aaa']]}
                            transitionDuration={300}
                            style={{ height: '30px' }}
                        />
                        <ReactAudioPlayer
                            className="section__preview-audio"
                            src="https://freewavesamples.com/files/Yamaha-V50-Industrial-Beat-120bpm.wav"
                            autoPlay
                            controls
                        />
                    </div>
                )}
            </Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Preview);
