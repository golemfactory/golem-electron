import React from 'react';
import { viewer, imageInfo } from './ImageZoom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'


const mapStateToProps = state => ({
    zoomRatio: state.input.zoomRatio
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


export class ControlPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {showSubtask, imgIndex, zoomRatio} = this.props
        return (
            <div className="container__control-panel">
                <span className="icon-arrow-left-white"/>
                <span>{parseInt(imgIndex) + 1} of 250</span>
                <span className="icon-arrow-right-white"/>
                <span className="icon-zoom-out" id="zoom-out"/>
                <span id="reset">{zoomRatio && zoomRatio.toFixed(2)}%</span>
                <span className="icon-zoom-in" id="zoom-in"/>
                <span className="icon-show-subtasks" onClick={showSubtask}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
