import React from "react";
import { BigNumber } from "bignumber.js";
import yup from "yup";

import Slider from "./../../../Slider.js";
import { modals, currencyIcons } from "./../../../../constants";

const { clipboard, remote } = window.electron;
const mainProcess = remote.require("./index");
const ETH_DENOM = 10 ** 18; //POW shorthand thanks to ES6
const GWEI_DENOM = 10 ** 9;

export default class WithdrawForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amountCopied: false,
            amount: new BigNumber(0.2).multipliedBy(ETH_DENOM),
            sendTo: "",
            isValid: false,
            isSubmitted: false,
            gasPriceOracle: {},
            adjustedGasPrice: new BigNumber(0), //GWEI
            gasLimit: new BigNumber(0) //WEI
        };
    }

    componentDidMount() {
        const { formData } = this.props;
        const gasPriceInGWEI = new BigNumber(formData.gasPrice).dividedBy(
            GWEI_DENOM
        );

        mainProcess.getEstimatedGasPrice().then(({ data }) => {
            this._getGasCostAsync(
                this.state.amount.toString(),
                this.state.sendTo,
                this.props.suffix
            ).then(gasLimit => {
                if (gasLimit)
                    this.setState({
                        gasPriceOracle: data,
                        adjustedGasPrice: gasPriceInGWEI.isGreaterThan(0)
                            ? gasPriceInGWEI
                            : new BigNumber(data.standard),
                        gasLimit: new BigNumber(gasLimit)
                    });
            });
        });

        this.inputSchema = {
            amount: yup.object().shape({
                amount: yup
                    .number()
                    .min(0.00001)
                    .max(this.props.balance.toNumber())
                    .required()
            }),

            sendTo: yup.object().shape({
                sendTo: yup
                    .string()
                    .matches(/^0x[a-fA-F0-9]{40}$/)
                    .required()
            })
        };

        this.formSchema = yup.object().shape({
            amount: yup
                .number()
                .min(0.00001)
                .max(this.props.balance.toNumber())
                .required(),
            sendTo: yup
                .string()
                .matches(/^0x[a-fA-F0-9]{40}$/)
                .required()
        });

        if (formData) {
            this.refs.amountInput.value = formData.amount.dividedBy(ETH_DENOM);
            this.refs.sendToInput.value = formData.sendTo;
            this.setState({
                amount: formData.amount,
                sendTo: formData.sendTo
            });
        }

        document.getElementById("sendToInput").addEventListener(
            "contextmenu",
            ev => {
                ev.preventDefault();
                ev.target.value = clipboard.readText();
                this._handleSendToChange.call(this, ev);
                return false;
            },
            false
        );
    }

    componentWillUnmount() {
        if (this.copyTimeout) {
            clearTimeout(this.copyTimeout);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { amount, sendTo } = nextState;

        if (amount !== this.state.amount || sendTo !== this.state.sendTo) {
            this.setState({
                isValid: this.formSchema.isValidSync({
                    amount: amount.dividedBy(ETH_DENOM),
                    sendTo
                })
            });
        }
    }

    /**
     * [_handleCancel funcs. closes modal]
     */
    _handleCancel = () => this.props.cancelHandler();

    /**
     * [_handleDelete func. send information as callback and close modal]
     */
    _handleApply = e => {
        e.preventDefault();
        const { amount, sendTo, adjustedGasPrice } = this.state;

        this.setState({
            isSubmitted: true
        });

        mainProcess
            .toChecksumAddress(sendTo) //Checksum ethereum address
            .then(sendToChecksum => {
                this._getGasCostAsync(
                    amount.toString(),
                    sendToChecksum,
                    this.props.suffix
                )
                    .then(gasLimit => {
                        if (gasLimit)
                            this.props.applyHandler(
                                amount,
                                sendToChecksum,
                                this.props.suffix,
                                new BigNumber(gasLimit),
                                adjustedGasPrice
                            );
                    })
                    .catch(error => console.error);
            })
            .catch(error => console.error);
    };

    _getGasCostAsync(amount, sendTo, type) {
        return new Promise((resolve, reject) =>
            this.props.actions.getGasCost(
                { amount, sendTo, type },
                resolve,
                reject
            )
        );
    }

    /**
     * [_handleCopyToClipboard funcs.  copies node id to the clipboard]
     * @param  {String}     nodeId      [NodeId of the user]
     * @param  {Event}      evt         [Clicked event]
     */
    _handleCopyToClipboard = evt => {
        const { balance } = this.props;
        if (balance) {
            this.refs.amountInput.value = balance;
            this.setState({
                amount: balance.multipliedBy(ETH_DENOM)
            });
            const isValid = this.inputSchema["amount"].isValidSync({
                amount: balance
            });
            if (isValid) this.refs.amountInput.classList.remove("invalid");
            else this.refs.amountInput.classList.add("invalid");

            this.setState(
                {
                    amountCopied: true
                },
                () => {
                    this.copyTimeout = setTimeout(() => {
                        this.setState({
                            amountCopied: false
                        });
                    }, 5000);
                }
            );
        }
    };

    checkInputValidity(e, type) {
        const isValid = this.inputSchema[type].isValidSync({
            [type]: e.target.value
        });
        if (isValid) e.target.classList.remove("invalid");
        else e.target.classList.add("invalid");

        return isValid;
    }

    _handleAmountChange = e => {
        this.checkInputValidity(e, "amount");
        this.setState({
            amount: new BigNumber(e.target.value || 0).multipliedBy(ETH_DENOM)
        });
    };

    _handleSendToChange = e => {
        this.checkInputValidity(e, "sendTo");
        this.setState({
            sendTo: e.target.value
        });
    };

    _preventSpace = event => {
        var key = event.which || window.event.which;
        if (key === 32) {
            event.preventDefault();
        }
    };

    /**
     * [_preventTypeAfterLimit max limit fixed to 9999999]
     * @param  {[type]} e [event]
     */
    _preventTypeAfterLimit = e => {
        const usdEstimation = document.getElementById("amountEstimatedUSD");

        if (parseFloat(e.currentTarget.value) >= 10 ** 7 - 1) {
            //9999999
            e.preventDefault();
        } else if (parseFloat(e.currentTarget.value) >= 10 ** 3 - 1) {
            //999
            usdEstimation.style.fontSize = 10;
            usdEstimation.style.marginTop = 10;
        } else {
            usdEstimation.style.fontSize = 12;
            usdEstimation.style.marginTop = 8.1;
        }
    };

    _handleGasFeeSlider = val => {
        this._getGasCostAsync(
            this.state.amount.toString(),
            this.state.sendTo,
            this.props.suffix
        ).then(gasLimit => {
            if (gasLimit)
                this.setState({
                    adjustedGasPrice: new BigNumber(val),
                    gasLimit: new BigNumber(gasLimit)
                });
        });
    };

    render() {
        const { type, suffix, currency, balance } = this.props;
        const {
            amountCopied,
            amount,
            isValid,
            isSubmitted,
            gasPriceOracle,
            adjustedGasPrice,
            gasLimit
        } = this.state;
        const adjustedGasPriceInETH = adjustedGasPrice
            .multipliedBy(gasLimit)
            .dividedBy(GWEI_DENOM);
        const totalAmount = amount
            .dividedBy(ETH_DENOM)
            .plus(adjustedGasPriceInETH);
        return (
            <form
                className="content__modal content__modal--form "
                onSubmit={this._handleApply}
                noValidate>
                <div>
                    <span className={`icon-${currencyIcons[suffix]}`} />
                    <div className="currency-tag">
                        <span className="label-currency">{suffix}</span>
                        <br />
                        <strong>{balance.toFixed(8)}...</strong>
                        <br />
                        <span className="label-estimation">
                            est. ${" "}
                            {balance.multipliedBy(currency[suffix]).toFixed(2)}
                            ...
                        </span>
                    </div>
                </div>
                <div className="form-field">
                    <label>Amount</label>
                    <input
                        ref="amountInput"
                        className="input__amount"
                        type="number"
                        min={0}
                        max={balance.toNumber()}
                        onKeyPress={this._preventTypeAfterLimit}
                        onChange={this._handleAmountChange}
                        required
                    />
                    <span className="currency">{suffix}</span>
                    <span
                        className={`${amountCopied ? "checkmark" : "copy"}`}
                        onClick={this._handleCopyToClipboard}>
                        {amountCopied ? "balance copied" : "copy balance"}
                    </span>
                    {amountCopied && (
                        <span className="status-copy">balance copied</span>
                    )}
                    <span
                        id="amountEstimatedUSD"
                        className="amount__estimation">
                        est. ${" "}
                        {amount
                            .dividedBy(ETH_DENOM)
                            .multipliedBy(currency[suffix])
                            .toFixed(2)}
                        ...
                    </span>
                </div>
                <div className="form-field">
                    <label>
                        Adjust transaction fee
                        <span className="average-cost">
                            {" "}
                            | standard transfer cost:{" "}
                            {gasPriceOracle.standard > 0 &&
                                Number(gasPriceOracle.standard).toFixed(1)}{" "}
                            gwei
                        </span>
                    </label>
                    <div className="gas_fee_slider">
                        {gasPriceOracle.standard > 0 ? (
                            <div>
                                <Slider
                                    inputId="gas_fee_slider"
                                    value={adjustedGasPrice.toNumber()}
                                    min={Math.trunc(gasPriceOracle.safeLow)}
                                    max={Math.trunc(gasPriceOracle.fastest)}
                                    step={0.1}
                                    mainColor={"#1c76e7"}
                                    aria-label="Adjust Gas Fee with Slider"
                                    callback={this._handleGasFeeSlider}
                                    warn={false}
                                />
                                <span className="slider__info-gas slider__info-gas--slow">
                                    Takes more time
                                </span>
                                <span className="slider__info-gas slider__info-gas--fast">
                                    Faster
                                </span>
                            </div>
                        ) : (
                            <div className="loading__slider">
                                <span>Gas price fetching...</span>
                            </div>
                        )}
                    </div>
                    <div className="total-amount__info">
                        <span>
                            Tx Fee. {adjustedGasPriceInETH.toFixed(8)} ETH
                        </span>
                    </div>
                </div>
                <div className="form-field">
                    <label>Sending to</label>
                    <input
                        id="sendToInput"
                        ref="sendToInput"
                        className="input__address"
                        type="text"
                        placeholder={`Type in ${suffix} address`}
                        onKeyPress={this._preventSpace}
                        onChange={this._handleSendToChange}
                        required
                    />
                </div>
                <div className="action__modal">
                    <span className="btn--cancel" onClick={this._handleCancel}>
                        Cancel
                    </span>
                    <button
                        type="submit"
                        className="btn--primary"
                        autoFocus
                        disabled={!isValid || isSubmitted}>
                        Apply
                    </button>
                </div>
            </form>
        );
    }
}
