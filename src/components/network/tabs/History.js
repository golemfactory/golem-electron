import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'

const mapStateToProps = state => ({
    historyList: state.history.historyList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class History extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [loadHistory loading payment history as DOM]
     */
    loadHistory() {
        const {historyList} = this.props
        return (historyList.map(({title, time, status, amount}, index) => <div key={index} className="item__history">
            <div className="info__history">
                <h5>{title}</h5>
                <span>{time}</span>
                <span>{status}</span>
            </div>
            <div className="action__history">
                <span className="amount__history">{amount}</span>
                <span className="icon-new-window"/>
            </div>
        </div>))
    }

    render() {
        const {historyList} = this.props
        console.log(historyList)
        return (
            <div className="content__history">
                {historyList.length > 0 ? this.loadHistory() : <div className="empty-list__history"><span>You don’t have any income or payment history yet.
                    Start Golem below to generate some.</span></div>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
