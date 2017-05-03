import React from 'react';
import ReactTooltip from 'rc-tooltip'
import { browserHistory } from 'react-router'
import { TransitionMotion, spring, presets } from 'react-motion'

import SingleFrame from './Single'
import convertSecsToHMS from './../../../utils/secsToHMS'

const UNDONE = 0
const PROGRESS = 1
const DONE = 2
const data = [
    {
        key: '0',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '1',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '2',
        data: {
            status: 1,
            duration: 1206
        }
    },
    {
        key: '3',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '4',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '5',
        data: {
            status: 2,
            duration: 1206
        }
    },
    {
        key: '6',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '7',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '8',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '9',
        data: {
            status: 1,
            duration: 1206
        }
    },
    {
        key: '10',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '11',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '12',
        data: {
            status: 2,
            duration: 1206
        }
    },
    {
        key: '13',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '14',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '15',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '16',
        data: {
            status: 1,
            duration: 1206
        }
    },
    {
        key: '17',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '18',
        data: {
            status: 0,
            duration: 1206
        }
    },
    {
        key: '19',
        data: {
            status: 2,
            duration: 1206
        }
    },
    {
        key: '20',
        data: {
            status: 0,
            duration: 1206
        }
    }
]

let status = [
    'frame--undone',
    'frame--progress',
    'frame--done'
]

Object.freeze(status)

export default class All extends React.Component {

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
        if (item.status === DONE) {
            browserHistory.push(`/preview/single/${id}`)
        }
    }

    _handleResubmit() {}



    // actual animation-related logic
    getDefaultStyles() {
        return data.map(item => {
            console.log(...item)
            return {
                ...item,
                style: {
                    width: 0,
                    opacity: 1
                }
            }
        });
    }

    getStyles() {
        const {show} = this.props
        return data.filter((item) => {
            return show == 'complete' ? item.data.status === DONE : true
        })
            .map((item, i) => {
                return {
                    ...item,
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


    willEnter() {
        return {
            width: 0,
            opacity: 1,
        };
    }

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


    /**
     * [loadAllFrames func. will load all frame items to the container]
     * @return      {DOM}    [frame-item div]
     */
    /*loadAllFrames() {
        const {show} = this.props
        return data
            .filter((item) => {
                return show == 'complete' ? item.status === DONE : true

            })
            .map((item, index) => <div className="item__all-frame" key={index.toString()}>
                <ReactTooltip
                overlayClassName="tooltip-frame"
                placement={`${index % 10 === 0 ? 'bottomLeft' : ((index % 10 === 9) ? 'bottomRight' : 'bottom')}`}
                trigger={['hover']}
                overlay={<div className="content__tooltip">
                            {item.status === DONE && <p className="status__tooltip">Completed</p>}
                            <p className={`time__tooltip ${item.status === DONE && 'time__tooltip--done'}`}>{convertSecsToHMS(item.duration)}</p>
                            <button onClick={this._handleResubmit.bind(this, item, index)}>Resubmit</button>
                        </div>}
                mouseEnterDelay={1}
                align={{
                    offset: [0, 10],
                }}>
                    <div className={`${status[item.status]}`} onClick={show == 'complete' && this._handleClick.bind(this, item, index)} onKeyDown={(event) => {
                    event.keyCode === 13 && (show == 'complete' && this._handleClick.call(this, item, index))
                }} role="button" tabIndex="0" aria-label="Preview of Frame"></div>
                </ReactTooltip>
            </div>)
    }*/

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
                            {data.status === DONE && <p className="status__tooltip">Completed</p>}
                            <p className={`time__tooltip ${data.status === DONE && 'time__tooltip--done'}`}>{convertSecsToHMS(data.duration)}</p>
                            <button onClick={this._handleResubmit.bind(this, data, index)}>Resubmit</button>
                        </div>}
                    align={{
                        offset: [0, 10],
                    }}  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                    <div className={`${status[data.status]}`} onClick={show == 'complete' && this._handleClick.bind(this, data, index)} onKeyDown={(event) => {
                        event.keyCode === 13 && (show == 'complete' && this._handleClick.call(this, data, index))
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
