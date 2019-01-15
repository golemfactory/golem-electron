import React, { Component } from 'react'
import {Tooltip} from 'react-tippy';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../actions'
import {getStatus, getPasswordModalStatus} from './../reducers'

import LoaderBar from './LoaderBar'
import checkNested from './../utils/checkNested'
import golem_loading from './../assets/img/golem-loading.svg'

const {remote, ipcRenderer} = window.electron;
const currentPlatform = remote.getGlobal('process').platform;
const versionGUI = remote.app.getVersion();


/*############# HELPER FUNCTIONS ############# */

function isGolemReady(gs) {
    return gs.status === "Ready" 
        && gs.message
        .toLowerCase()
        .includes("node");
}

const mapStateToProps = state => ({
    connectionProblem: state.info.connectionProblem,
    status: getStatus(state, 'golemStatus'),
    passwordModal: getPasswordModalStatus(state, 'passwordModal'),
    chosenPreset: state.advanced.chosenPreset,
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats,
    isEngineLoading: state.info.isEngineLoading,
    version: state.info.version
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class FooterMain extends Component {

     constructor(props) {
        super(props);
        this.state = {
            engineLoading: false
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.isEngineOn !== this.props.isEngineOn) {
            this.setState({
                engineLoading: false
            })
        }
    }

    _golemize() {
        const {actions, isEngineOn, isEngineLoading, chosenPreset} = this.props
        if (isEngineOn) {
            actions.stopGolem()
        } else if (!isEngineLoading) {
            actions.startGolem(chosenPreset)
        }
    }

    //TODO re-write it cleaner
    golemDotClass(_golemStatus, _connectionProblem){
        if(_golemStatus && isGolemReady(_golemStatus)){
            return (_connectionProblem && _connectionProblem.status) ? "yellow" : "green"
        }
        else if(_golemStatus && _golemStatus.status !== "Exception"){
            return "yellow"
        }
        return "red"
    }

    _loadErrorUrl(msg){
        switch (msg) {
            case "Error creating Docker VM":    //docker
                return  <a href={currentPlatform === "win32" 
                            ? "https://golem.network/documentation/09-common-issues-troubleshooting/docker-errors-on-windows-10/" 
                            : "https://golem.network/documentation/09-common-issues-troubleshooting/docker-errors-mac/"}>
                            <span className="icon-new-window"/>
                        </a>
            case "Outdated hyperg version":     //hyperg
                return  <a href="https://golem.network/documentation/09-common-issues-troubleshooting/other-common-errors/#outdated-hyperg-version">
                            <span className="icon-new-window"/>
                        </a>
            case "Chain sync error":            //sync
                return  <a href="https://golem.network/documentation/09-common-issues-troubleshooting/other-common-errors/#sync">
                            <span className="icon-new-window"/>
                        </a>
                break;
            case "Error connecting geth":       //geth
                return  <a href="https://golem.network/documentation/09-common-issues-troubleshooting/other-common-errors/#geth">
                            <span className="icon-new-window"/>
                        </a>
            default:
                break;
        }
    }

    _openLogs = () => {
        ipcRenderer.send('open-logs')
    }
    
    _fetchState(stat){
        if(stat){
            let state = stat.status;
            if(checkNested(stat, 'environment')){
                state += this._fetchEnvironment(stat.environment)
            }
            return state
        }
        
    }

    _fetchEnvironment(env){
            switch(env) {
                case "BLENDER":         return " (CPU)"
                case "BLENDER_NVGPU":   return " (GPU)"
                case "BLENDER_SGX":     return " (SGX)"
            }
    }

    _loadConnectionError(status, connectionProblem){
        return [
            (checkNested(status, 'client', 'message')) 
                ? status.client.message.length > 10
                    ? <br key="br"/>
                    : ""
                : <br key="br"/>,
            connectionProblem.issue == "PORT" 
                ? <span key="infoPorts" className="info__ports">
                        problem with ports
                        <a href="https://golem.network/documentation/09-common-issues-troubleshooting/port-forwarding-connection-errors/#getting-started">
                            <span className="icon-new-window"/>
                        </a>
                    </span> 
                : connectionProblem.issue == "WEBSOCKET" 
                    ? <span key="infoPorts" className="info__ports">
                            connection dropped
                        </span> 
                    : ""
        ]
    }

    render() {
        const {status, connectionProblem, isEngineOn, stats, engineLoading, isEngineLoading, passwordModal, version} = this.props
        const versionTemplate = version && (version.error ? version.message : `${version.message}${version.number}`);

        return (
            <div className="content__footer-main">
                <div className="section__actions">
                    <div className="section__actions-status">
                        <Tooltip
                          open={checkNested(status, 'client', 'status')
                                && status.client.status !== "Ready"
                                && checkNested(passwordModal, 'status')
                                && !passwordModal.status}
                          distance={17}
                          html={
                            <div className="status__components">
                                <div className="item__status">
                                    <span>Docker: </span>
                                    <span>{status.docker 
                                            ? status.docker.message
                                            : <LoaderBar/>}
                                    </span>
                                </div>
                                <div className="item__status">
                                    <span>Geth: </span>
                                    <span>{status.ethereum 
                                            ? status.ethereum.message
                                            : <LoaderBar/>}
                                    </span>
                                </div>
                                <div className="item__status">
                                    <span>Hyperg: </span>
                                    <span>{status.hyperdrive 
                                            ? status.hyperdrive.message
                                            : <LoaderBar/>}
                                    </span>
                                </div>
                                <div className="item__status">
                                    <span>Hypervisor: </span>
                                    <span>{status.hypervisor 
                                            ? status.hypervisor.message 
                                            : <LoaderBar/>}
                                    </span>
                                </div>
                            </div>
                        }
                          position="top"
                          unmountHTMLWhenHide>
                            <span className={`progress-status indicator-status indicator-status--${this.golemDotClass(status.client, connectionProblem)}`}/>
                        </Tooltip>
                        
                        <div>
                            <span>
                                <span className="status-message">
                                    {status.client 
                                        ? <span>{status.client.message}</span> 
                                        : <span>
                                            Outdated version
                                            <a href="https://github.com/golemfactory/golem#installing-and-testing">
                                                <span className="icon-new-window"/>
                                            </a>
                                        </span>}
                                </span>
                                {status.client && ::this._loadErrorUrl(status.client.message)}
                                {this._loadConnectionError(status, connectionProblem)}
                            </span>
                            {!!Object.keys(stats).length
                                ? <div className="status-node">
                                    <span>Provider state: {this._fetchState(stats.provider_state)}</span>
                                    <br/>
                                    <span>Attempted: {(stats.subtasks_computed) && (stats.subtasks_computed[1] + stats.subtasks_with_timeout[1] + stats.subtasks_with_errors[1])}</span>
                                    <br/>
                                    <span>{stats.subtasks_with_errors && `${stats.subtasks_with_errors[1]} error | ${stats.subtasks_with_timeout[1]} timeout | ${stats.subtasks_computed[1]} success` }</span>
                                </div>
                                : 
                                <div className="status-node__loading">
                                    {
                                        checkNested(status, 'client', 'status') 
                                        && status.client.status !== "Exception"
                                        ?   <span>
                                                Warming up
                                                <span className="jumping-dots">
                                                    <span className="dot-1">.</span>
                                                    <span className="dot-2">.</span>
                                                    <span className="dot-3">.</span>
                                                </span>
                                            </span>
                                        : <span>Error while fetching status</span>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <button className={`btn--primary ${isEngineOn ? 'btn--yellow' : ''}`} onClick={::this._golemize}>{isEngineOn ? 'Stop' : 'Start'} Golem</button>
                </div>
                <div className="content__footer-social">
                    <span className="element__footer" onClick={this._openLogs}>
                        <span className="icon-logs"/>
                        <u>open logs</u>
                    </span>
                    <a className="element__footer" href="https://www.github.com/golemfactory">
                        <span className="icon-golem-logo"/>{versionTemplate}
                    </a>
                    <a className="element__footer" href="https://chat.golem.network">
                        <span className="icon-chat"/>
                        <u>golem chat</u>
                    </a>
                </div>
                <div>
                    <div className={`loading-indicator ${isEngineLoading ? 'active' : ''}`}></div>
                    <object className={`loading-icon ${isEngineLoading ? 'active' : ''}`} type="image/svg+xml" data={golem_loading}></object>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterMain)