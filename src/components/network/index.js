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
import golem_svg from './../../assets/img/golem.svg'
import Indicator from './Indicator'
import Wallet from '../wallet'
import Resources from './tabs/Resources'
import History from './tabs/History'
import Advanced from './tabs/Advanced'
import FooterMain from '../FooterMain'
import PresetModal from './modal/PresetModal'
import ManagePresetModal from './modal/ManagePresetModal'
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
    connectionProblem: state.info.connectionProblem,
    golemStatus: state.realTime.golemStatus,
    chosenPreset: state.advanced.chosenPreset,
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats,
    isEngineLoading: state.info.isEngineLoading,
    version: state.info.version
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
            managePresetModal: false,
            modalData: null,
            engineLoading: false,
            isPresetNameExist: false
        }
    //props.actions.setOnboard(true)
    }

    /**
     * [_handlePresetModal func. will trigger presetModal state to make preset modal visible]
     * @param  {Object}      data       [Custom hardware preset object]
     */
    _handlePresetModal(data) {
        //console.log(data)
        this.setState({
            presetModal: true,
            modalData: data
        })
    }

    /**
     * [_handleManagePresetModal func. will trigger managePresetModal state to make manage preset modal visible]
     */
    _handleManagePresetModal() {
        this.setState({
            managePresetModal: true
        })
    }

    /**
     * [_closeModal funct. will make all modals invisible]
     */
    _closeModal() {
        this.setState({
            presetModal: false,
            managePresetModal: false,
            modalData: null,
            isPresetNameExist: false
        })
    }

    /**
     * [_handleSavePreset func. will create hardware preset with given custom hardware preset object]
     * @param  {Object}     data    [Custom hardware preset object]
     */
    _handleSavePreset(data) {
        this._savePresetAsync(data).then( result => {
                this.setState({
                    isPresetNameExist: result === "wamp.error.runtime_error"
                })

                if(result !== "wamp.error.runtime_error")
                    this._closeModal()
            })
    }

    _savePresetAsync(data){
        return new Promise((_resolve, _reject) => {
            this.props.actions.createAdvancedPreset(data, _resolve, _reject)
        })
    }

    componentDidMount() {
        const {actions} = this.props
        const endLoading = () => {
            actions.endLoading("MAIN_LOADER")
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
        const tabPanel = document.getElementById('networkTab');
        const tabTitles = tabPanel.childNodes;
        for (var i = 0; i < tabTitles.length; i++) {
            tabTitles[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
        this.setState({
            activeTab: elm.target.getAttribute('value')
        })
    }

    // <img src={golem_svg} className="loading-logo"/>
    render() {
        const {message, actions, autoLaunch, connectionProblem, golemStatus, isEngineOn, isEngineLoading, balance, currency, version} = this.props
        const {activeTab, presetModal, managePresetModal, modalData, isPresetNameExist} = this.state

        return (
            <div className="content__main">
            <Wallet balance={balance} currency={currency}/>
            <div className="section__quick-settings">
                <div id="networkTab" className="tab-panel" role="tablist">
                    <div className="tab__title active" value='0' onClick={::this._handleTab} role="tab" tabIndex="0">Resources</div>
                    <div className="tab__title" value='1' onClick={::this._handleTab} role="tab" tabIndex="0">History</div>
                    <div className="tab__title" value='2' onClick={::this._handleTab} role="tab" tabIndex="0">Advanced</div>
                </div>
                <div className="tab__content">
                    {activeTab == 0 && <Resources role="tabpanel"/>}
                    {activeTab == 1 && <History role="tabpanel"/>}
                    {activeTab == 2 && <Advanced role="tabpanel" modalHandler={::this._handlePresetModal} manageHandler={::this._handleManagePresetModal} />}
                </div>
            </div>
            {presetModal && <PresetModal closeModal={::this._closeModal} saveCallback={this._handleSavePreset.bind(this)} isNameExist={isPresetNameExist} {...modalData}/>}
            {managePresetModal && <ManagePresetModal closeModal={::this._closeModal}/>}
            <FooterMain {...this.props}/>
        </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainFragment)