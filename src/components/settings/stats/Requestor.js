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

export class RequestorStats extends React.PureComponent {

    render() {
        const {isEngineOn, stats} = this.props
        return (
            <div>
                <div className="no-stats">No available data.</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestorStats)
