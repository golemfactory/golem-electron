import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Tooltip} from 'react-tippy';
import { TransitionMotion, spring, presets } from 'react-motion'

import * as Actions from '../../../actions'
import {getFilteredPaymentHistory} from '../../../reducers'
import { timeStampToHR } from '../../../utils/secsToHMS'

const mainEtherscan = "https://etherscan.io/tx/0x"
const testEtherscan = "https://rinkeby.etherscan.io/tx/0x"
const ETH_DENOM = 10 ** 18;

const filter = {
    PAYMENT: 'payment',
    INCOME: 'income'
}

const mapStateToProps = state => ({
    isMainNet: state.info.isMainNet,
    isEngineOn: state.info.isEngineOn,
    paymentHistory: getFilteredPaymentHistory.bind(null, state),
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0
        }
    }

    /**
     * [_handleTab to change active class of selected tab title]
     *
     * @param   {Object}     elm     [target element]
     */
    _handleTab(elm) {
        const tabPanel = document.getElementById('historyTab')
        const tabTitles = tabPanel.childNodes;
        for (var i = 0; i < tabTitles.length; i++) {
            tabTitles[i].classList.remove('active')
        }
        elm.currentTarget.classList.add('active')
        this.setState({
            activeTab: elm.target.getAttribute('value')
        })
    }

    /**
     * [getStyles func. updated style list]
     * @return {Array} [style list of the animated item]
     */
    getStyles(_list, _filter) {
        return _list(_filter)
    }

    /**
     * [willEnter func. DOM elements enter animation]
     * @return {Object} [Style object]
     */
    willEnter() {
        return {
            height: 0,
            opacity: 0,
            borderWidth: 0
        };
    }

    /**
     * [willLeave DOM elements leave animation]
     * @return {Object} [Style object]
     */
    willLeave() {
        return {
            height: spring(0, {
                stiffness: 150,
                damping: 22
            }),
            opacity: spring(0, {
                stiffness: 150,
                damping: 22
            }),
            borderWidth: spring(0, {
                stiffness: 150,
                damping: 22
            }),
        };
    }

    /**
     * [loadHistory loading payment history as DOM]
     */
    loadHistory(_list, _filter = null) {
        const { isMainNet} = this.props
        return <TransitionMotion
            defaultStyles={_list(null, true)}
            styles={::this.getStyles(_list, _filter)}
            willLeave={::this.willLeave}
            willEnter={::this.willEnter}>
            {styles => <div>
                {styles
                .map(({key, data, style}) => {
                    const {payee, payer, created, status, value, type, transaction} = data;
                    return <div key={key} style={style} className="item__history">
                        <div className="info__history">
                            <h5>{(payee || payer).substr(0, 24)}...</h5>
                            <span>{timeStampToHR(created)}</span>
                            <span className="status__history">{status}</span>
                        </div>
                        <div className="action__history">
                            <span className="amount__history">
                                <span className={`finance__indicator ${type === filter.INCOME 
                                    ? 'indicator--up' 
                                    : 'indicator--down'}`}>
                                        {type === filter.INCOME ? '+ ' : '- '}
                                        </span>{(value / ETH_DENOM).toFixed(4)} GNT
                            </span>
                            {transaction && <Tooltip
                              html={(<p>See on Etherscan</p>)}
                              position="bottom"
                              trigger="mouseenter"
                            >
                                <a href={`${isMainNet ? mainEtherscan : testEtherscan}${transaction}`}><span className="icon-new-window"/></a>
                            </Tooltip>}
                         </div>
                    </div>}
            )}
           </div>}
          </TransitionMotion>
    }

    render() {
        const {isEngineOn, paymentHistory} = this.props
        const {activeTab} = this.state
        const filteredList = this.loadHistory(paymentHistory, activeTab)
        return (
            <div className="content__history">
                <div id="historyTab" className="tab-panel tab--sticky" role="tablist">
                    <div className="tab__title active" value={null} onClick={::this._handleTab} role="tab" tabIndex="0">All</div>
                    <div className="tab__title" value="income" onClick={::this._handleTab} role="tab" tabIndex="0">Incoming</div>
                    <div className="tab__title" value="payment" onClick={::this._handleTab} role="tab" tabIndex="0">Outgoing</div>
                </div>
                <div>
                    {(paymentHistory && filteredList.props.styles.length > 0)
                        ? filteredList
                        : <div className="empty-list__history">
                            <span>You don’t have any {activeTab ? activeTab : "earnings or payment"} yet.
                            <br/>
                            {isEngineOn ? "" : "Start Golem below to generate some."}</span>
                        </div>}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
