import React, { Component } from 'react';
import { Spring } from 'react-spring/renderprops.cjs';
import Tooltip from '@tippy.js/react';
import { BigNumber } from 'bignumber.js';

import { timeStampToHR } from './../../utils/time';
import checkNested from './../../utils/checkNested';
import { currencyIcons } from './../../constants';

const mainEtherscan = 'https://etherscan.io/address/';
const testEtherscan = 'https://rinkeby.etherscan.io/address/';

let motionBalanceStart = {};

function isGolemReady(golemStatus) {
  return (
    checkNested(golemStatus, 'client', 'status') &&
    golemStatus.client.status === 'Ready'
  );
}

export default class CurrencyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyRate: 1,
      amountPrecision: 4
    };

    if (!motionBalanceStart[props.suffix]) {
      motionBalanceStart[props.suffix] = 0;
    }
    if (!motionBalanceStart[`${props.suffix}-USD`]) {
      motionBalanceStart[`${props.suffix}-USD`] = 0;
    }
  }

  componentDidMount() {
    const item = this.refs['currencyBox' + this.props.suffix];
    item &&
      item.addEventListener('animationend', this._removeItem.bind(this, item));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expandedAmount !== this.props.expandedAmount) {
      this.setState({
        amountPrecision: nextProps.expandedAmount ? 8 : 4
      });
    }
  }

  _removeItem(item) {
    const { expandedAmount, suffix } = this.props;
    if (expandedAmount !== suffix && expandedAmount !== null) {
    }
  }

  _formatAmount = (_balance, _suffix, currency = 1) => {
    const totalBalance = this.props.balance
      .precision(this.state.amountPrecision)
      .toString();

    const animatedBalance = new BigNumber(_balance.toString())
      .dividedBy(currency)
      .precision(this.state.amountPrecision)
      .toString();

    if (
      totalBalance === animatedBalance &&
      motionBalanceStart[_suffix] !== _balance
    ) {
      motionBalanceStart[_suffix] = _balance;
    }

    if (_suffix.includes('USD')) {
      return _balance.toFixed(2);
    }

    return _balance.toFixed(this.state.amountPrecision);
  };

  _toggleFlipper() {
    const item = this.refs['currencyBox' + this.props.suffix];
    item && item.classList.toggle('flip');
  }

  render() {
    const {
      balance,
      lockedBalance,
      currency,
      contractAddresses,
      lastUpdate,
      suffix,
      description,
      descriptionLock,
      descriptionWaiting,
      descriptionUnconverted,
      clickHandler,
      expandAmount,
      expandedAmount,
      isMainNet,
      golemStatus,
      lockWithdraw
    } = this.props;
    const contractUrlGNTB =
      contractAddresses &&
      `${isMainNet ? mainEtherscan : testEtherscan}${contractAddresses.GNTB}`;
    return (
      <div className="container__currency-box">
        <div
          id="cube"
          className={
            expandedAmount
              ? expandedAmount === suffix
                ? 'show-top'
                : 'show-front'
              : 'show-top'
          }>
          <div className={`side1 ${suffix}`}>
            <span className="lock__container">
              Locked:
              <span>
                <b>{lockedBalance[expandedAmount === 'GNT' ? 0 : 1]}</b>
                <Tooltip
                  content={descriptionLock || 'No information'}
                  placement="bottom"
                  trigger="mouseenter"
                  interactive={true}>
                  <span className="icon-question-mark" />
                </Tooltip>
              </span>
            </span>
            {expandedAmount === 'GNT' && (
              <span className="lock__container">
                Waiting:
                <span>
                  <b>{lockedBalance[2]}</b>
                  <Tooltip
                    content={descriptionWaiting || 'No information'}
                    placement="bottom"
                    trigger="mouseenter"
                    interactive={true}>
                    <span className="icon-question-mark" />
                  </Tooltip>
                </span>
              </span>
            )}
          </div>
          <div className="side2">
            <div
              ref={'currencyBox' + suffix}
              className="content__currency-box flipper"
              onClick={expandAmount.bind(this, suffix)}>
              <div className="front">
                <span className="last-update">
                  Last update: {lastUpdate ? timeStampToHR(lastUpdate) : '-'}
                </span>
                <div>
                  <img src={currencyIcons[suffix]} className="currency-logo" />
                </div>
                <div>
                  <Spring
                    from={{
                      balanceAnimated: motionBalanceStart[suffix]
                    }}
                    to={{
                      balanceAnimated: Number(balance)
                    }}>
                    {({ balanceAnimated }) => (
                      <span className="amount">
                        {this._formatAmount(Number(balanceAnimated), suffix)}
                        {!expandedAmount && '...'}
                        <span className="currency-suffix">
                          {!isMainNet ? 't' : ''}
                          {suffix}
                        </span>
                      </span>
                    )}
                  </Spring>
                  <Spring
                    from={{
                      balanceAnimated: motionBalanceStart[`${suffix}-USD`]
                    }}
                    to={{
                      balanceAnimated: Number(
                        balance.multipliedBy(currency[suffix])
                      )
                    }}>
                    {({ balanceAnimated }) => (
                      <span className="amount amount-usd">
                        est. {!isMainNet ? 't' : ''}${' '}
                        {this._formatAmount(
                          Number(balanceAnimated),
                          `${suffix}-USD`,
                          currency[suffix]
                        )}
                        ...
                      </span>
                    )}
                  </Spring>
                </div>
                <div className="locked-amount">
                  <Spring
                    from={{
                      balanceAnimated: motionBalanceStart[`${suffix}-USD`]
                    }}
                    to={{
                      balanceAnimated: Number(
                        balance.multipliedBy(currency[suffix])
                      )
                    }}>
                    {({ balanceAnimated }) => (
                      <span>
                        Locked:{' '}
                        <span className="amount">
                          {this._formatAmount(
                            Number(lockedBalance[suffix === 'GNT' ? 0 : 1]),
                            `${suffix}`,
                            currency[suffix]
                          )}
                        </span>{' '}
                        {!isMainNet ? 't' : ''}
                        {suffix}{' '}
                      </span>
                    )}
                  </Spring>
                </div>
                <Tooltip
                  content={description}
                  placement="bottom"
                  trigger="mouseenter"
                  interactive={true}
                  className="tip">
                  <span className="icon-question-mark" />
                </Tooltip>
                <div className="action-menu">
                  <button
                    className="btn--ghost wallet__btn-withdraw"
                    onClick={() => this._toggleFlipper()}>
                    <span className="icon-details" />
                    Details
                  </button>
                  <button
                    className="btn--ghost wallet__btn-withdraw"
                    onClick={() => clickHandler(suffix, currency, balance)}
                    disabled={
                      !isMainNet || !isGolemReady(golemStatus) || lockWithdraw
                    }>
                    <span className="icon-download" />
                    Withdraw
                  </button>
                </div>
              </div>
              <div className="back">
                <div>
                  <div className="available-amount">
                    <span>Available amount</span>
                    <Spring
                      from={{
                        balanceAnimated: motionBalanceStart[suffix]
                      }}
                      to={{
                        balanceAnimated: Number(balance)
                      }}>
                      {({ balanceAnimated }) => (
                        <span className="amount">
                          {this._formatAmount(Number(balanceAnimated), suffix)}
                          {!expandedAmount && '...'}
                          <span className="currency-suffix">
                            {!isMainNet ? 't' : ''}
                            {suffix}
                          </span>
                        </span>
                      )}
                    </Spring>
                  </div>
                  <div className="locked-amount">
                    <Tooltip
                      content={descriptionLock || 'No information'}
                      placement="top"
                      trigger="mouseenter">
                      <span>Locked:</span>
                    </Tooltip>
                    <Spring
                      from={{
                        balanceAnimated: motionBalanceStart[`${suffix}-USD`]
                      }}
                      to={{
                        balanceAnimated: Number(
                          balance.multipliedBy(currency[suffix])
                        )
                      }}>
                      {({ balanceAnimated }) => (
                        <span>
                          <span className="amount">
                            {this._formatAmount(
                              Number(lockedBalance[suffix === 'GNT' ? 0 : 1]),
                              `${suffix}`,
                              currency[suffix]
                            )}
                          </span>{' '}
                          {!isMainNet ? 't' : ''}
                          {suffix}{' '}
                        </span>
                      )}
                    </Spring>
                  </div>
                  {suffix === 'GNT' ? (
                    <div className="unconverted-amount">
                      <Tooltip
                        content={descriptionUnconverted || 'No information'}
                        placement="top"
                        trigger="mouseenter">
                        <span>Unconverted:</span>
                      </Tooltip>
                      <Spring
                        from={{
                          balanceAnimated: motionBalanceStart[`${suffix}-USD`]
                        }}
                        to={{
                          balanceAnimated: Number(
                            balance.multipliedBy(currency[suffix])
                          )
                        }}>
                        {({ balanceAnimated }) => (
                          <span>
                            <span className="amount">
                              {this._formatAmount(
                                Number(lockedBalance[2]),
                                `${suffix}`,
                                currency[suffix]
                              )}
                            </span>{' '}
                            {!isMainNet ? 't' : ''}
                            {suffix}{' '}
                          </span>
                        )}
                      </Spring>
                    </div>
                  ) : (
                    <div className="unconverted-amount" />
                  )}
                </div>
                <div className="batch-contract-adress">
                  <span>
                    GNTb contract address
                    <a href={contractUrlGNTB}>
                      <span className="icon-new-window" />
                    </a>
                  </span>
                </div>
                <div className="action-menu">
                  <button
                    className="btn--ghost wallet__btn-withdraw"
                    onClick={() => this._toggleFlipper()}>
                    <span className="icon-back" />
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
