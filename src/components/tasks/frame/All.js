import React from 'react';
import ReactTooltip from 'rc-tooltip'
import { hashHistory } from 'react-router'
import { TransitionMotion, spring, presets } from 'react-motion'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'

import SingleFrame from './Single'
import { timeStampToHR } from './../../../utils/secsToHMS'

const statusDict = Object.freeze({
    NOTSTARTED: 'Not started',
    COMPUTING: 'Computing',
    FINISHED: 'Finished',
    ABORTED: 'Aborted'
})

let statusClassDict = {
    'Not started': 'frame--undone',
    'Computing': 'frame--progress',
    'Finished': 'frame--done',
    'Aborted': 'frame--error'
}

Object.freeze(statusClassDict)

const mapStateToProps = state => ({
    details: state.details.detail,
    frameList: state.all.frameList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class All extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [_handleClick func. will redirect related single frame]
     * @param       {[type]} item       [completed frame item]
     * @param       {[type]} id         [description] //TODO we gonna delete this arg. cuz item arg. will be enough to get id.
     * @return nothing
     */
    _handleClick(item, id) {
        console.log(item)
        if (item.status === statusDict.FINISHED) {
            hashHistory.push(`/preview/single/${id}`)
        }
    }

    _handleResubmit() {}



    /**
     * [getDefaultStyles func. actual animation-related logic]
     * @return  {Array}    [default style list of the animated item]
     */
    getDefaultStyles() {
        const {frameList} = this.props
        return frameList.map((item, index) => {
            console.log(statusClassDict[item[1][0]])
            return {
                key: item[0].toString(),
                data: {
                    status: item[1][0],
                    created: item[1][1]
                },
                style: {
                    width: 0,
                    opacity: 1
                }
            }
        });
    }

    /**
     * [getStyles func. updated style list]
     * @return {Array} [style list of the animated item]
     */
    getStyles() {
        const {show, frameList} = this.props
        return frameList.filter((item, index) => {
            return show == 'complete' ? item[1][0] === statusDict.FINISHED : true
        })
            .map((item, i) => {
                return {
                    key: item[0].toString(),
                    data: {
                        status: item[1][0],
                        created: item[1][1]
                    },
                    style: {
                        width: spring(71.6, {
                            stiffness: 300,
                            damping: 32
                        }),
                        opacity: spring(1, {
                            stiffness: 300,
                            damping: 32
                        }),
                    }
                };
            });
    }

    /**
     * [willEnter func. DOM elements enter animation]
     * @return {Object} [Style object]
     */
    willEnter() {
        return {
            width: 0,
            opacity: 1,
        };
    }

    /**
     * [willLeave DOM elements leave animation]
     * @return {Object} [Style object]
     */
    willLeave() {
        return {
            width: spring(0, {
                stiffness: 300,
                damping: 32
            }),
            opacity: spring(0, {
                stiffness: 300,
                damping: 32
            }),
        };
    }

    render() {
        const {show} = this.props
        return (
            <div>
                <TransitionMotion
            defaultStyles={::this.getDefaultStyles()}
            styles={::this.getStyles()}
            willLeave={::this.willLeave}
            willEnter={::this.willEnter}>
            {styles => <div className="container__all-frame">
                    {styles.map(({key, data, style}, index) => <div className="item__all-frame" key={index.toString()} style={style}>
                <ReactTooltip
                    overlayClassName="tooltip-frame"
                    placement={`${index % 10 === 0 ? 'bottomLeft' : ((index % 10 === 9) ? 'bottomRight' : 'bottom')}`}
                    trigger={['hover']}
                    mouseEnterDelay={1}
                    overlay={<div className="content__tooltip">
                            {data.status === statusDict.FINISHED && <p className="status__tooltip">Completed</p>}
                            <p className={`time__tooltip ${data.status === statusDict.FINISHED && 'time__tooltip--done'}`}>{data.created ? timeStampToHR((data.created * (10 ** 3)).toFixed(0)) : 'Not started'}</p>
                            <button onClick={this._handleResubmit.bind(this, null, index)}>Resubmit</button>
                        </div>}
                    align={{
                        offset: [0, 10],
                    }}  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                    <div className={`${statusClassDict[data.status]}`} onClick={show == 'complete' && this._handleClick.bind(this, null, index)} onKeyDown={(event) => {
                        event.keyCode === 13 && (show == 'complete' && this._handleClick.call(this, null, index))
                    }} role="button" tabIndex="0" aria-label="Preview of Frame"></div>
                </ReactTooltip>
            </div>
                )}
                </div>
            }
          </TransitionMotion>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(All)