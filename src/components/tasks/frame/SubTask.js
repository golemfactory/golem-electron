import React from 'react';
import ReactTooltip from 'rc-tooltip'

import { convertSecsToHMS, timeStampToHR } from './../../../utils/secsToHMS'

const UNDONE = 0
const PROGRESS = 1
const DONE = 2


const arrayColumn = (arr, n) => arr.map(x => x[n]);

const subTaskData = {
    key: '0',
    data: {
        status: 0,
        duration: 1206
    }
}

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

export default class SubTask extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    handleResubmit(id) {
        this.props.restartSubtask(id)
    }


    drawLine() {
        const {data, ratio, subtaskList} = this.props
        let subIDList = []
        var path = Object.keys(data).map(function(anchestorKey) {
            subIDList.push(anchestorKey)
            return Object.keys(data[anchestorKey]).map(function(parentKey) {
                return Object.keys(data[anchestorKey][parentKey]).map(function(childKey, index) {
                    return data[anchestorKey][parentKey][childKey] * (ratio + 0.028) // <--  Calculating border coordinates with given ratio
                });
            });
        });


        function flatten(arr) {
            arr.push(arr[0])
            return [].concat(...arr).toString().replace(/(,[^,]*),/g, '$1 ')
        }

        /**
         * [tooltipOffset func. finding max right and bottom points of the polyline]
         * @param  {[Array]}    arr    [Array of the path item]
         * @return {[Array]}            [Array for the max right point and max bottom point]
         *
         * @description This function will be modified for the non-square shapes
         */
        function tooltipOffset(arr) {
            let horizontalPoints = arrayColumn(arr, 0)
            let maxHorizontalLength = Math.max(...horizontalPoints)
            let minHorizontalLength = Math.min(...horizontalPoints)
            let verticalPoints = arrayColumn(arr, 1)
            let maxVerticalLength = Math.max(...verticalPoints)
            let minVerticalLength = Math.min(...verticalPoints)
            return [(maxHorizontalLength - minHorizontalLength) / 2, (maxVerticalLength - minVerticalLength) / 5]
        }

        return path
            .sort((a, b) => {
                let verticalPointA = arrayColumn(a, 1)[0]
                let verticalPointB = arrayColumn(b, 1)[0]
                return verticalPointA - verticalPointB
            })
            .map((item, index) => {
                let subtask = subtaskList.filter(sub => sub.subtask_id === subIDList[index])[0]
                return <ReactTooltip
                    key={index.toString()}
                    overlayClassName="tooltip-frame"
                    placement={index === path.length - 1 ? 'top' : 'bottom' }
                    trigger={['hover']}
                    mouseEnterDelay={1}
                    overlay={<div className="content__tooltip">
                        {subtask.status === statusDict.FINISHED && <p className="status__tooltip">Completed</p>}
                        <p className={`time__tooltip ${subtask.status === statusDict.FINISHED && 'time__tooltip--done'}`}>{timeStampToHR((subtask.time_started * (10 ** 3)).toFixed(0))}</p>
                        <button type="button" onClick={this.handleResubmit.bind(this, subtask.subtask_id)}>Resubmit</button>
                    </div>}
                    align={{
                        offset: tooltipOffset(item),
                    }}  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                <polyline key={index.toString()} fill="transparent" stroke="black"
                    points={flatten(item)}/>
            </ReactTooltip>
            })
    }

    render() {
        const {offset} = this.props
        let customStyle = {}
        if (offset.direction === 'y') {
            customStyle = {
                top: offset.value
            }
        } else if (offset.direction === 'x') {
            customStyle = {
                left: offset.value
            }
        }
        return (
            <div id="frameSVG" style={customStyle}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {this.drawLine()}
        </svg>
      </div>
        );
    }
}
