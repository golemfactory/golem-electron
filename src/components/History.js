import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Tooltip } from "react-tippy";
import { Transition, animated, config } from "react-spring";
import { AutoSizer, List, defaultCellRangeRenderer } from "react-virtualized";
const posed = require("react-pose");
const { PoseGroup } = posed;

import * as Actions from "../actions";
import { getFilteredPaymentHistory } from "../reducers";
import { timeStampToHR } from "../utils/secsToHMS";

const { remote } = window.electron;
const mainProcess = remote.require("./index");
const isWin = mainProcess.isWin();
const isMac = mainProcess.isMac();

const mainEtherscan = "https://etherscan.io/tx/0x";
const testEtherscan = "https://rinkeby.etherscan.io/tx/0x";
const ETH_DENOM = 10 ** 18;

const filter = {
  PAYMENT: "payment",
  INCOME: "income"
};

const Item = posed.default.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const mapStateToProps = state => ({
  isMainNet: state.info.isMainNet,
  isEngineOn: state.info.isEngineOn,
  paymentHistory: getFilteredPaymentHistory.bind(null, state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  /**
   * [_handleTab to change active class of selected tab title]
   *
   * @param   {Object}     elm     [target element]
   */
  _handleTab = elm => {
    const tabPanel = document.getElementById("historyTab");
    const tabTitles = tabPanel.childNodes;
    for (var i = 0; i < tabTitles.length; i++) {
      tabTitles[i].classList.remove("active");
    }
    elm.currentTarget.classList.add("active");
    this.setState({
      activeTab: elm.target.getAttribute("value")
    });
  };

  /**
   * [getStyles func. updated style list]
   * @return {Array} [style list of the animated item]
   */
  getStyles = (_list, _filter) => {
    return _list(_filter);
  };

  defaultStyle = () => {
    return {
      height: 0,
      opacity: 0,
      borderWidth: 0
    };
  };

  /**
   * [willEnter func. DOM elements enter animation]
   * @return {Object} [Style object]
   */
  willEnter = () => {
    return {
      height: 76,
      opacity: 1,
      borderWidth: 1
    };
  };

  /**
   * [willLeave DOM elements leave animation]
   * @return {Object} [Style object]
   */
  willLeave = () => {
    return {
      height: 0,
      opacity: 0,
      borderWidth: 0
    };
  };

  cellRangeRenderer(props) {
    const children = defaultCellRangeRenderer(props);
    const animatedChildren = <PoseGroup key="list">{children.map(item => <Item key={item.key}>{item}</Item>)}</PoseGroup>;

    return [animatedChildren];
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    const { paymentHistory } = this.props;
    const { activeTab } = this.state;
    const { isMainNet } = this.props;
    const filteredList = paymentHistory(activeTab);
    const tx = filteredList[index];
    const { payee, payer, created, status, value, type, transaction } = tx.data;

    const content = (
      <div className="item__history">
        <div className="info__history">
          <h5>{(payee || payer).substr(0, 24)}...</h5>
          <span>{timeStampToHR(created)}</span>
          <span className="status__history">{status}</span>
        </div>
        <div className="action__history">
          <span className="amount__history">
            <span className={`finance__indicator ${type === filter.INCOME ? "indicator--up" : "indicator--down"}`}>
              {type === filter.INCOME ? "+ " : "- "}
            </span>
            {(value / ETH_DENOM).toFixed(4)} GNT
          </span>
          {transaction && (
            <Tooltip html={<p>See on Etherscan</p>} position="bottom" trigger="mouseenter">
              <a href={`${isMainNet ? mainEtherscan : testEtherscan}${transaction}`}>
                <span className="icon-new-window" />
              </a>
            </Tooltip>
          )}
        </div>
      </div>
    );

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  render() {
    const { isEngineOn, paymentHistory, toggleTransactionHistory } = this.props;
    const { activeTab } = this.state;
    const filteredList = paymentHistory(activeTab);
    return (
      <div className="content__history">
        <div id="historyTab" className="tab-panel tab--sticky" role="tablist">
          <div className="tab__title active" value={null} onClick={this._handleTab} role="tab" tabIndex="0">
            All
          </div>
          <div className="tab__title" value="income" onClick={this._handleTab} role="tab" tabIndex="0">
            Incoming
          </div>
          <div className="tab__title" value="payment" onClick={this._handleTab} role="tab" tabIndex="0">
            Outgoing
          </div>
          <div className="tab__back">
            <span onClick={toggleTransactionHistory}><span className="icon-back-up"/>Back</span>
          </div>
        </div>
        <div>
          {paymentHistory && filteredList.length > 0 ? (
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 auto", height: "100%" }}>
                <AutoSizer>
                  {({ width, height }) => {
                    return (
                      <List
                        width={width}
                        height={height - 48} //offset of height
                        cellRangeRenderer={this.cellRangeRenderer}
                        rowCount={filteredList.length}
                        rowHeight={76}
                        rowRenderer={this.rowRenderer}
                      />
                    );
                  }}
                </AutoSizer>
              </div>
            </div>
          ) : (
            <div className="empty-list__history">
              <span>
                You don’t have any {activeTab ? activeTab : "earnings or payment"} yet.
                <br />
                {isEngineOn ? "" : "Start Golem below to generate some."}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
