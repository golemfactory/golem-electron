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

export class ACL extends React.Component {

    render() {
        return (
            <div className="content__acl">
                <div className="no-data">No available data.</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ACL)
