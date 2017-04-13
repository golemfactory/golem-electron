import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import golem_logo from './../../assets/img/golem-tray.png'

import Indicator from './Indicator'
import Resources from './tabs/Resources'
import History from './tabs/History'
import Advanced from './tabs/Advanced'
/*if (!("require" in window)) {
    console.info("This browser does not support electron features.");
} else {
    const electron = window.require('electron')
}*/

const mapStateToProps = state => ({
    message: state.realTime.message,
    currency: state.currency,
    autoLaunch: state.input.autoLaunch
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


/**
 * { Class for main fragment component. Aka. Homepage }
 *
 * @class      MainFragment (name)
 */
export class MainFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0
        }
    }

    componentDidMount() {
        const {actions} = this.props
        const endLoading = () => {
            actions.endLoading("MAIN_LOADER")
            // To replay animation
            /*Object.keys(require.cache).forEach(function(key) {
                delete require.cache[key]
            })*/

            /*!!!!!!!!!!!!!!!!! EXPERIMENTAL !!!!!!!!!!!!!!*/
            if (!("Notification" in window)) {
                console.info("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
            else if (Notification.permission === "granted") {
                let myNotification = new Notification('Golem', {
                    body: 'Loaded!',
                    icon: golem_logo,
                    requireInteraction: true
                })
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission(function(permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        let myNotification = new Notification('Golem', {
                            body: 'Loaded!',
                            icon: golem_logo,
                            requireInteraction: true
                        })
                    }
                });
            }
        }

        actions.startLoading("MAIN_LOADER", "I am loading!")
        setTimeout(endLoading, 8000)
    }

    /**
     * [_handleAutoLaunchSwitch onChange function for switch input]
     */
    _handleAutoLaunchSwitch() {
        const {actions} = this.props
        const {autoLaunchSwitch} = this.refs
        actions.setAutoLaunch(autoLaunchSwitch.checked)
    }

    /**
     * [_handleTab to change active class of selected tab title]
     * 
     * @param   {Object}     elm     [target element]
     */
    _handleTab(elm) {
        let tabTitles = document.getElementsByClassName('tab__title')
        for (var i = 0; i < tabTitles.length; i++) {
            tabTitles[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
        this.setState({
            activeTab: elm.target.getAttribute('value')
        })
    }

    render() {
        const {message, actions, autoLaunch} = this.props
        const {activeTab} = this.state
        return (
            <div className="content__main">
                <div className="section__currency">
                    <Indicator {...this.props}/>
                </div>
            <div className="section__quick-settings">
            <div className="tab-panel">
                <div className="tab__title active" value='0' onClick={::this._handleTab}>Resources</div>
                <div className="tab__title" value='1' onClick={::this._handleTab}>History</div>
                <div className="tab__title" value='2' onClick={::this._handleTab}>Advanced</div>
            </div>
                <div className="tab__content">
                    {activeTab == 0 && <Resources/>}
                    {activeTab == 1 && <History/>}
                    {activeTab == 2 && <Advanced/>}
                </div>
            </div>
            <div className="section__actions">
                <div className="section__actions-status">
                    <span className="icon-status-dot icon-status-dot--active "/>
                    <span>240 Nodes</span>
                </div>
                <button className="btn--primary">Start Golem</button>
            </div>
        </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainFragment)