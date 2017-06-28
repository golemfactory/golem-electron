import React from 'react';
import ReactTooltip from 'rc-tooltip'

import { convertSecsToHMS, timeStampToHR } from './../../../utils/secsToHMS'

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

    handleResubmit(id) {
        this.props.restartSubtask(id)
    }


    drawLine() {
        const {data, ratio, subtaskList} = this.props
        let subIDList = []
        var path = Object.keys(data).map(function(anchestorKey) {
            subIDList.push(anchestorKey)
            return Object.keys(data[anchestorKey]).map(function(parentKey) {
                return Object.keys(data[anchestorKey][parentKey]).map(function(childKey) {
                    return data[anchestorKey][parentKey][childKey] * (ratio + 0.028)
                });
            });
        });

        console.log("path", path)

        function flatten(arr) {
            return [].concat(...arr).toString().replace(/(,[^,]*),/g, '$1 ')
        }

        /**
         * [offset func. finding max right and bottom points of the polyline]
         * @param  {[Array]}    arr    [Array of the path item]
         * @return {[Array]}            [Array for the max right point and max bottom point]
         *
         * @description This function will be modified for the non-square shapes
         */
        function offset(arr) {
            arr = [].concat(...[].concat(...arr)).sort().reverse()
            let uniq = a => [...new Set(a)];
            arr = uniq(arr)
            console.log("offset", arr.slice(0, 2))
            return arr.slice(0, 2)
        }

        return path.map((item, index) => {

            let subtask = subtaskList.filter(sub => sub.subtask_id === subIDList[index])[0]
            return <ReactTooltip
                key={index.toString()}
                overlayClassName="tooltip-frame"
                placement="bottom"
                trigger={['hover']}
                mouseEnterDelay={1}
                overlay={<div className="content__tooltip">
                        {subtask.status === statusDict.FINISHED && <p className="status__tooltip">Completed</p>}
                        <p className={`time__tooltip ${subtask.status === statusDict.FINISHED && 'time__tooltip--done'}`}>{timeStampToHR((subtask.time_started * (10 ** 3)).toFixed(0))}</p>
                        <button type="button" onClick={this.handleResubmit.bind(this, subtask.subtask_id)}>Resubmit</button>
                    </div>}
                align={{
                    offset: [(Math.max(...offset(item)) / 2), 20],
                }}  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                <polyline key={index.toString()} fill="transparent" stroke="black"
                points={flatten(item)}/>
            </ReactTooltip>
        }
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
