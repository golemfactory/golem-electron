import React from 'react';
import { browserHistory } from 'react-router'

import ControlPanel from './ControlPanel'
import ImageZoom from './ImageZoom'
import SubTask from './SubTask'

const path = [
    [
        [1, 1],
        [1, 149],
        [99, 149],
        [99, 74],
        [751, 74],
        [751, 1],
        [1, 1]
    ],
    [
        [1, 151],
        [1, 299],
        [751, 299],
        [751, 76],
        [101, 76],
        [101, 151],
        [1, 151]
    ],
    [
        [1, 301],
        [1, 390],
        [199, 390],
        [199, 301],
        [1, 301]
    ],
    [
        [201, 301],
        [201, 390],
        [399, 390],
        [399, 301],
        [201, 301]
    ],
    [
        [401, 301],
        [401, 390],
        [751, 390],
        [751, 301],
        [401, 301]
    ]
]
const CLOSE_BTN_PATH = '/preview/complete';

let tmpIndex = 0

export default class Single extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubtaskShown: false
        }
        this._showSubtask = ::this._showSubtask
    }

    componentDidMount() {
        console.log(this.props.id)
    }
    /**
     * [_showSubtask func. will draw canvas paths over the image to show subtask of render.]
     * @return  nothing
     */
    _showSubtask() {
        this.setState({
            isSubtaskShown: !this.state.isSubtaskShown
        })
    }

    /**
     * [_handleClose function for close single frame componenet]
     * @return nothing
     */
    _handleClose() {
        browserHistory.push(CLOSE_BTN_PATH)
    }

    render() {
        const {isSubtaskShown} = this.state
        const {id, preview, actions} = this.props
        return (
            <div className="section__frame">
                <span className="button__subtask" onClick={::this._handleClose} onKeyDown={(event) => {
                event.keyCode === 13 && this._handleClose.call(this)
            }} role="button" tabIndex="0" aria-label="Close Single Preview"><span className="icon-cross"/></span>
                <div className="section__image" ref="containerImage">
                    <ImageZoom image="http://i.amz.mshcdn.com/7j6AkcDAU6D0RIsbIZVI7boC8Kw=/1200x627/2013%2F05%2F09%2Fdb%2FTeslaModelS.66c4e.jpg" />
                    {isSubtaskShown && <SubTask data={path}/>}
                </div>
                <ControlPanel showSubtask={this._showSubtask} imgIndex={id}/>
            </div>
        );
    }
}
