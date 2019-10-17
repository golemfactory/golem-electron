import React, { Fragment } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WavePlayer from '../WavePlayer';
import * as Actions from '../../actions';

import golemIcon from '../../assets/img/preview-thumb.svg';

const mapStateToProps = state => ({
    taskList: state.realTime.taskList,
    frameCount: state.preview.ps.frameCount
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

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
                        <WavePlayer source="http://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0018_8k.wav"/>
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
