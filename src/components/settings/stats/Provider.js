import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../../../actions'

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class ProviderStats extends React.Component {

    render() {
        const {isEngineOn, stats} = this.props
        return (
            <div>
                <h4>Task Statistics</h4>
                { (stats && Number.isInteger(stats.in_network)) ?
                    <div className="statistics__task"> 
                        <div>
                            <span className="icon-tasks-all"/>
                            <span>Tasks on network: {stats.in_network}</span>
                        </div>
                        <div>
                            <span className="icon-tasks-supported"/>
                            <span>Supported tasks: {stats.supported}</span>
                        </div>
                        <div>
                            <span className="icon-finished"/>
                            <span>Computed subtasks: {stats.subtasks_computed[1]}</span>
                        </div>
                        <div>
                            <span className="icon-subtask-verifying"/>
                            <span>Accepted subtasks: {stats.subtasks_accepted[1]}</span>
                        </div>
                        <div>
                            <span className="icon-failure"/>
                            <span>Subtasks with errors: {stats.subtasks_with_errors[1]}</span>
                        </div>
                        <div>
                            <span className="icon-timeout"/>
                            <span>Subtasks with timeouts: {stats.subtasks_with_timeout[1]}</span>
                        </div>
                        <div>
                            <span className="icon-subtask-verifying"/>
                            <span>Rejected subtasks: {stats.subtasks_rejected[1]}</span>
                        </div>
                    </div>
                    :
                    <div className="no-stats">No available data.</div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProviderStats)
