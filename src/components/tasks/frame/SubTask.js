import React from 'react';
import ReactTooltip from 'rc-tooltip'

import convertSecsToHMS from './../../../utils/secsToHMS'

const UNDONE = 0
const PROGRESS = 1
const DONE = 2

const subTaskData = {
    key: '0',
    data: {
        status: 0,
        duration: 1206
    }
}
export default class SubTask extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }


    drawLine() {
        const {data} = this.props

        var path = Object.keys(data).map(function(anchestorKey) {
            return Object.keys(data[anchestorKey]).map(function(parentKey) {
                return Object.keys(data[anchestorKey][parentKey]).map(function(childKey) {
                    return data[anchestorKey][parentKey][childKey] * 2.52
                });
            });
        });

        console.log(path)

        function flatten(arr) {
            return [].concat(...arr)
        }

        return path.map((item, index) => <ReactTooltip
            key={index.toString()}
            overlayClassName="tooltip-frame"
            placement={`${index % 10 === 0 ? 'bottomLeft' : ((index % 10 === 9) ? 'bottomRight' : 'bottom')}`}
            trigger={['hover']}
            mouseEnterDelay={1}
            overlay={<div className="content__tooltip">
                        {index === DONE && <p className="status__tooltip">Completed</p>}
                        <p className={`time__tooltip ${index === DONE && 'time__tooltip--done'}`}>{convertSecsToHMS(subTaskData.data.duration)}</p>
                        <button>Resubmit</button>
                    </div>}
            align={{
                offset: [0, 10],
            }}  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                <polyline key={index.toString()} fill="transparent" stroke="black"
            points={flatten(item).toString().replace(/(,[^,]*),/g, '$1 ')}/>
            </ReactTooltip>
        )
    }

    render() {
        return (
            <div id="frameCanvas">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {this.drawLine()}
        </svg>
      </div>
        );
    }
}
