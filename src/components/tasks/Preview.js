import React from 'react';
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

import golemIcon from '../../assets/img/golem.png'


const mapStateToProps = state => ({
    taskList: state.realTime.taskList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Preview extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            previewSRC: null
        }
    }

    // componentWillUpdate(nextProps, nextState) {
    //     const {id, taskList} = this.props
    //     if (id) {
    //         let nextTask = nextProps.taskList.filter((item => item.id === id
    //         ))[0]
    //         let task = taskList.filter((item => item.id === id
    //         ))[0]
    //         if (!!task && !!nextTask) {
    //             if (task.progress !== nextTask.progress || this.state.previewSRC === null || nextTask.preview !== this.state.previewSRC) {
    //                 let preview = nextProps.taskList.filter((item) => item.id === id)[0].preview
    //                 this.setState({
    //                     previewSRC: preview
    //                 })
    //             }
    //         }
    //     }
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return !!this.props.id
    // }


    render() {
        const {id, src, taskList} = this.props
        let preview = id && taskList.filter((item) => item.id === id)[0].preview
        const {previewSRC} = this.state

        return (
            <div className="section__preview-black">
                <img src={src ? `file://${preview}?${new Date().getTime()}` : 'error'} alt="Task Preview" ref={img => this.img = img} onError={
            (e) => {
                e.preventDefault(); return this.img.src = golemIcon
            }}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)