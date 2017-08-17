import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'
import { timeStampToHR } from '../../../utils/secsToHMS'

const etherscan = "https://rinkeby.etherscan.io/tx/0x"
const ETH_DENOM = 10 ** 18;

/*############# HELPER FUNCTIONS ############# */

function newestToOldest(a, b) {
    if (a.created < b.created)
        return 1;
    if (a.created > b.created)
        return -1;
    return 0;
}

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
        return (historyList.sort(newestToOldest).map(({payee, payer, created, status, value, type, transaction}, index) => <div key={index} className="item__history">
            <div className="info__history">
                <h5>{(payee || payer).substr(0, 32)}...</h5>
                <span>{timeStampToHR(created)}</span>
                <span className="status__history">{status}</span>
            </div>
            <div className="action__history">
                <span className="amount__history">{type === "income" ? '+ ' : '- '}{(value / ETH_DENOM).toFixed(2)}</span>
                {transaction && <a href={`${etherscan}${transaction}`}><span className="icon-new-window"/></a>}
            </div>
        </div>))
    }

    render() {
        const {historyList} = this.props
        //console.log(historyList)
        return (
            <div className="content__history">
                {historyList.length > 0 ? this.loadHistory() : <div className="empty-list__history"><span>You don’t have any income or payment history yet.
                    Start Golem below to generate some.</span></div>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
