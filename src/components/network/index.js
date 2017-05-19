import React from 'react'
/**
 * react-a11y is an Accessibility control tool
 * @see https://github.com/reactjs/react-a11y
 * @see https://www.w3.org/TR/wai-aria/
 */
import a11y from 'react-a11y'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import golem_logo from './../../assets/img/golem-tray.png'

import Indicator from './Indicator'
import Resources from './tabs/Resources'
import History from './tabs/History'
import Advanced from './tabs/Advanced'
import PresetModal from './modal/PresetModal'
/*if (!("require" in window)) {
    console.info("This browser does not support electron features.");
} else {
    const electron = window.require('electron')
}*/

//a11y(React)

const mapStateToProps = state => ({
    balance: state.realTime.balance,
    currency: state.currency,
    autoLaunch: state.input.autoLaunch,
    connectedPeers: state.realTime.connectedPeers
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
            activeTab: 0,
            presetModal: false,
            modalData: null
        }


    //props.actions.setOnboard(true)
    }

    _handleSavePresetModal(data) {
        console.log(data)
        this.setState({
            presetModal: true,
            modalData: data
        })
    }

    _closeModal() {
        this.setState({
            presetModal: false,
            modalData: null
        })
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
        const {message, actions, autoLaunch, connectedPeers} = this.props
        const {activeTab, presetModal, modalData} = this.state
        return (
            <div className="content__main">
                <div className="section__currency">
                    <Indicator {...this.props}/>
                </div>
            <div className="section__quick-settings">
            <div className="tab-panel" role="tablist">
                <div className="tab__title active" value='0' onClick={::this._handleTab} role="tab" tabIndex="0">Resources</div>
                <div className="tab__title" value='1' onClick={::this._handleTab} role="tab" tabIndex="0">History</div>
                <div className="tab__title" value='2' onClick={::this._handleTab} role="tab" tabIndex="0">Advanced</div>
            </div>
                <div className="tab__content">
                    {activeTab == 0 && <Resources role="tabpanel"/>}
                    {activeTab == 1 && <History role="tabpanel"/>}
                    {activeTab == 2 && <Advanced role="tabpanel" modalHandler={::this._handleSavePresetModal}/>}
                </div>
            </div>
            {presetModal && <PresetModal closeModal={::this._closeModal} {...modalData}/>}
            <div className="section__actions">
                <div className="section__actions-status">
                    <span className="icon-status-dot icon-status-dot--active "/>
                    <span>{connectedPeers} {connectedPeers > 1 ? 'Nodes' : 'Node'}</span>
                </div>
                <button className="btn--primary">Start Golem</button>
            </div>
        </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainFragment)