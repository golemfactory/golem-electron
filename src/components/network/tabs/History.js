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

const etherscan = "https://rinkeby.etherscan.io/tx/0x"

export class History extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [loadHistory loading payment history as DOM]
     */
    loadHistory() {
        function isDateToday(date) {
            let today = new Date();
            let givenDay = new Date(date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
            return (today.toDateString() == givenDay.toDateString());
        }

        function timeStampToHR(timestamp) {
            console.log("timestamp", timestamp);
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var date = new Date(Number(timestamp));
            console.log("date", date);
            var days = "0" + date.getDate();
            var month = "0" + (date.getMonth() + 1); //January is 0!
            var year = date.getFullYear();

            var formattedDate = days.substr(-2) + '/' + month.substr(-2) + '/' + year;
            // Hours part from the timestamp
            var hours = "0" + date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return `${isDateToday(formattedDate) ? '' : formattedDate + ' -'} ${formattedTime}`
        }

        function newestToOldest(a, b) {
            if (a.created < b.created)
                return 1;
            if (a.created > b.created)
                return -1;
            return 0;
        }
        ;

        const {historyList} = this.props
        return (historyList.sort(newestToOldest).map(({payee, payer, created, status, value, type, transaction}, index) => <div key={index} className="item__history">
            <div className="info__history">
                <h5>{(payee || payer).substr(0, 32)}...</h5>
                <span>{timeStampToHR((created * (10 ** 3)).toFixed(0))}</span>
                <span className="status__history">{status}</span>
            </div>
            <div className="action__history">
                <span className="amount__history">{type === "income" ? '+ ' : '- '}{(value / (10 ** 18)).toFixed(2)}</span>
                {transaction && <a href={`${etherscan}${transaction}`}><span className="icon-new-window"/></a>}
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
