import React, { Component } from 'react'
import checkNested from './../utils/checkNested'
import golem_loading from './../assets/img/golem-loading.svg'

const {remote} = window.electron;
const currentPlatform = remote.getGlobal('process').platform;
const versionGUI = remote.app.getVersion();


/*############# HELPER FUNCTIONS ############# */

function isGolemReady(status) {
    return status === "Ready"
}

export default class FooterMain extends Component {

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
        if(isGolemReady(_golemStatus.status)){
            return (_connectionProblem && _connectionProblem.status) ? "yellow" : "green"
        }
        else if(_golemStatus.status !== "Exception"){
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

    _fetchState(stat){
        if(stat){
            let state = stat.status;
            if(checkNested(stat, 'environment')){
                state += this._fetchEnvironment(stat.environment[0])
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

    render() {
        const {status, connectionProblem, isEngineOn, stats, engineLoading, isEngineLoading, version} = this.props
        const versionTemplate = version && (version.error ? version.message : `${version.message}${version.number}`);
        return (
            <div className="content__footer-main">
                <div className="section__actions">
                    <div className="section__actions-status">
                        <span className={`progress-status indicator-status indicator-status--${this.golemDotClass(status, connectionProblem)}`}/>
                        
                        <div>
                            <span>
                                <span className="status-message">{`${status.message} `}</span>
                                {::this._loadErrorUrl(status.message)}
                                {(status.message && status.message.length > 10) && <br/>}
                                {connectionProblem.status ? <span className="info__ports">problem with ports<a href="https://golem.network/documentation/09-common-issues-troubleshooting/port-forwarding-connection-errors/#getting-started"><span className="icon-new-window"/></a></span> : ""}
                            </span>
                            <div className="status-node">
                                <span>Provider state: {stats ? this._fetchState(stats.provider_state) : ""}</span>
                                <br/>
                                <span>Attempted: {(stats && stats.subtasks_computed) && (stats.subtasks_computed[1] + stats.subtasks_with_timeout[1] + stats.subtasks_with_errors[1])}</span>
                                <br/>
                                <span>{(stats && stats.subtasks_with_errors) && `${stats.subtasks_with_errors[1]} error | ${stats.subtasks_with_timeout[1]} timeout | ${stats.subtasks_computed[1]} success` }</span>
                            </div>
                        </div>
                    </div>
                    <button className={`btn--primary ${isEngineOn ? 'btn--yellow' : ''}`} onClick={::this._golemize}>{isEngineOn ? 'Stop' : 'Start'} Golem</button>
                </div>
                <div className="content__footer-social">
                    <a href="https://www.github.com/golemfactory">
                        <u>github page</u>
                    </a>
                    <span>{versionTemplate}</span>
                    <a href="https://chat.golem.network">
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