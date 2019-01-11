import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Tooltip} from 'react-tippy';

import * as Actions from './../actions'

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})
/**
 * { Class for footer component. }
 *
 * @class      NotificationCenter (name)
 */
export class NotificationCenter extends Component {
    constructor(props) {
        super(props)
    }

    /**
     * [_navigateTo active class handling for navigation items]
     * @param  {String}     to      [Route fo the page]
     * @param  {Object}     _       [Element in target]
     */
    _navigateTo(to) {
        if(window.routerHistory.location.pathname !== to)
            window.routerHistory.push(to);
    }

    _fetchNotification = () => {
        
        const concentTemplate = <span onClick={this._navigateTo.bind(this, "/settings")}>
                    You are not using Concent service and thus are not fully secure. 
                    <span className="link--navigate" onClick={this._navigateTo.bind(this, "/settings")}>
                    <br/>Turn on Concent</span> or 
                    <a href="https://docs.golem.network"> Learn more</a> about it.
                </span>

        return [concentTemplate]
            .map( (item, index) => <div className="list-item__notification" key={index.toString()}>
                            <span className="bullet__list"/>
                            <span>{item}</span>
                        </div>)
    }

    render() {
        const {  } = this.props
        return (
            <div className="list__notification">
                { this._fetchNotification() }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCenter)