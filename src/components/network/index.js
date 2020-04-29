import React from "react";
/**
 * react-a11y is an Accessibility control tool
 * @see https://github.com/reactjs/react-a11y
 * @see https://www.w3.org/TR/wai-aria/
 */
import a11y from "react-a11y";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Actions from "../../actions";

import golem_logo from "./../../assets/img/golem-tray.png";
import golem_svg from "./../../assets/img/golem.svg";
import Indicator from "./Indicator";
import TransactionTube from "../transaction";
import Wallet from "../wallet";
import Resources from "./Resources";
import History from "../History";
import PresetModal from "./modal/PresetModal";
import ManagePresetModal from "./modal/ManagePresetModal";
/*if (!("require" in window)) {
    console.info("This browser does not support electron features.");
} else {
    const electron = window.require('electron')
}*/

//a11y(React)

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

/**
 * { Class for main fragment component. Aka. Homepage }
 *
 * @class      MainFragment (name)
 */
export class MainFragment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            presetModal: false,
            managePresetModal: false,
            modalData: null,
            engineLoading: false,
            isPresetNameExist: false,
            toggleHistory: false
        };
        //props.actions.setOnboard(true)
    }

    /**
     * [_handlePresetModal func. will trigger presetModal state to make preset modal visible]
     * @param  {Object}      data       [Custom hardware preset object]
     */
    _handlePresetModal(data) {
        //console.log(data)
        this.setState({
            presetModal: true,
            modalData: data
        });
    }

    /**
     * [_handleManagePresetModal func. will trigger managePresetModal state to make manage preset modal visible]
     */
    _handleManagePresetModal() {
        this.setState({
            managePresetModal: true
        });
    }

    /**
     * [_closeModal funct. will make all modals invisible]
     */
    _closeModal = () => {
        this.setState({
            presetModal: false,
            managePresetModal: false,
            modalData: null,
            isPresetNameExist: false
        });
    };

    /**
     * [_handleSavePreset func. will create hardware preset with given custom hardware preset object]
     * @param  {Object}     data    [Custom hardware preset object]
     */
    _handleSavePreset(data) {
        this._savePresetAsync(data).then(result => {
            this.setState({
                isPresetNameExist: result === "wamp.error.runtime_error"
            });

            if (result !== "wamp.error.runtime_error") this._closeModal();
        });
    }

    _savePresetAsync(data) {
        return new Promise((_resolve, _reject) => {
            this.props.actions.createAdvancedPreset(data, _resolve, _reject);
        });
    }

    componentDidMount() {
        const { actions } = this.props;
        const endLoading = () => {
            actions.endLoading("MAIN_LOADER");
        };

        actions.startLoading("MAIN_LOADER", "I am loading!");
        setTimeout(endLoading, 8000);
    }

    _toggleTransactionHistory = () => {
        this.setState({
            toggleHistory: !this.state.toggleHistory
        });
    };

    // <img src={golem_svg} className="loading-logo"/>
    render() {
        const { message, actions, autoLaunch} = this.props;
        const {
            presetModal,
            managePresetModal,
            modalData,
            isPresetNameExist,
            toggleHistory
        } = this.state;

        return (
            <div className="content__main">
                <Wallet />
                {!toggleHistory ? (
                    [
                        <TransactionTube
                            toggleTransactionHistory={
                                this._toggleTransactionHistory
                            }
                            key="transaction"
                        />,
                        <Resources key="resources" />
                    ]
                ) : (
                    <History
                        toggleTransactionHistory={
                            this._toggleTransactionHistory
                        }
                    />
                )}
                {presetModal && (
                    <PresetModal
                        closeModal={this._closeModal}
                        saveCallback={this._handleSavePreset.bind(this)}
                        isNameExist={isPresetNameExist}
                        {...modalData}
                    />
                )}
                {managePresetModal && (
                    <ManagePresetModal closeModal={this._closeModal} />
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(React.memo(MainFragment));
