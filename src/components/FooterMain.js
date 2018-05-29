import React, { Component } from 'react'
const {remote} = window.electron;
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
        const {actions, isEngineOn, chosenPreset} = this.props
        if (isEngineOn) {
            actions.stopGolem()
        } else {
            actions.startGolem(chosenPreset)
        }
        this.setState({
            engineLoading: true
        })
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

    render() {
        const {golemStatus, connectionProblem, isEngineOn, stats} = this.props
        const {engineLoading} = this.state
        return (
            <div className="content__footer-main">
                <div className="section__actions">
                    <div className="section__actions-status">
                        <span className={`progress-status indicator-status indicator-status--${this.golemDotClass(golemStatus, connectionProblem)}`}/>
                        
                        <div>
                            <span>
                                <span className="status-message">{`${golemStatus.message}`}</span>
                                {(golemStatus.message && golemStatus.message.length > 10) && <br/>}
                                {connectionProblem.status ? <span className="info__ports">problem with ports<a href="https://chat.golem.network"><span className="icon-new-window"/></a></span> : ""}
                            </span>
                            <div className="status-node">
                                <span>Provider state: {stats && stats.host_state}</span>
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
                    <span>Brass Golem v{versionGUI}</span>
                    <a href="https://chat.golem.network">
                        <u>golem chat</u>
                    </a>
                </div>
                <div className={`loading-indicator ${engineLoading ? 'active' : ''}`}/>
            </div>
        );
    }
}