import React from 'react';
import { findDOMNode } from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'

import SingleFrame from './Single'
import CompleteFrame from './Complete'
import AllFrame from './All'

const mapStateToProps = state => ({
    preview: state.input.preview,
    blender_data: state.realTime.blender
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


/**
 * { Class for Frame component. }
 *
 * @class      Frame (name)
 */
export class Frame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMenu: 0
        }
    }

    componentDidMount() {
        const {actions} = this.props
        const endLoading = () => {
            actions.endLoading("FRAME_LOADER")
        // To replay animation
        /*Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key]
        })*/
        }

        actions.startLoading("FRAME_LOADER", "I am loading!")
        setTimeout(endLoading, 8000)
    }

    /**
     * [_handleTab to change active class of selected tab title]
     * 
     * @param   {Object}     elm     [target element]
     */
    _handleMenu(elm) {
        console.log('test')
        let menuItems = document.getElementsByClassName('menu__item')
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
        this.setState({
            activeMenu: elm.target.getAttribute('value')
        })
    }


    render() {
        const {activeMenu} = this.state
        return (
            <div className="container__frame">
                <div className="header__frame">
                    <div className="title">
                        <span>HMD Model Bake 3.5</span>
                    </div>
                    <div className="info">
                        <span className="time">1:21:15 Remaining</span>
                        <span className="amount__frame">250 Frames</span>
                    </div>
                    <div className="menu">
                        <span className="menu__item active" onClick={::this._handleMenu} value="0">Complete</span>
                        <span className="menu__item" onClick={::this._handleMenu} value="1">All</span>
                    </div>
                </div>
                {activeMenu == 0 && <CompleteFrame/> }
                {activeMenu == 1 && <AllFrame/> }
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Frame)
