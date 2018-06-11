import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../../actions'

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Stats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {isEngineOn, stats} = this.props
        return (
            <div className="content__stats">
                { (stats && Number.isInteger(stats.in_network)) ?
                    <div> 
                        <p>Tasks on network: {stats.in_network}</p>
                        <p>Supported tasks: {stats.supported}</p>
                        <p>Computed subtask: {stats.subtasks_computed[1]}</p>
                        <p>Subtask with errors: {stats.subtasks_with_errors[1]}</p>
                        <p>Subtask with timeouts: {stats.subtasks_with_timeout[1]}</p>
                    </div>
                    :
                    <div className="no-stats">No available data.</div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats)
