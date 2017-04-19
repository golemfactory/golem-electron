import React from 'react';
import ReactTooltip from 'rc-tooltip'

import convertSecsToHMS from './../../../utils/secsToHMS'

const UNDONE = 0
const PROGRESS = 1
const DONE = 2
const data = [
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 2,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 2,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 2,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
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

    _handleClick(index) {
        console.log(index)
    }

    loadAllFrames() {
        const {show} = this.props
        return data
            .filter((item) => {
                return show == 0 ? item.status === DONE : true

            })
            .map((item, index) => <div className="item__all-frame" key={index}>
            <ReactTooltip
                overlayClassName="tooltip-frame"
                placement={`${index % 10 === 0 ? 'bottomLeft' : ((index % 10 === 9) ? 'bottomRight' : 'bottom')}`}
                trigger={['hover']}
                overlay={<div className="content__tooltip">
                        {item.status === DONE && <p className="status__tooltip">Completed</p>}
                        <p className={`time__tooltip ${item.status === DONE && 'time__tooltip--done'}`}>{convertSecsToHMS(item.duration)}</p>
                        <button onClick={this._handleClick.bind(this, index)}>Resubmit</button>
                    </div>}
                mouseEnterDelay={1}
                align={{
                    offset: [0, 10],
                }}>
                <div className={`${status[item.status]}`}></div>
                    </ReactTooltip>
            </div>)
    }

    render() {
        return (
            <div className="container__all-frame">
                { this.loadAllFrames()}
            </div>
        );
    }
}
