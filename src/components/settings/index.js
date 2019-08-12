import React from "react";
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Actions from "../../actions";

import Personal from "./Personal";
import Performance from "./Performance";
import Price from "./Price";
import Concent from "./Concent";
import ConcentModal from "./modal/ConcentModal";
import Trust from "./Trust";
import FileLocation from "./FileLocation";
import Geth from "./Geth";
import Stats from "./Stats";
import Peers from "./Peers";
import { APP_VERSION } from "./../../main";

const { remote } = window.electron;
const { dialog } = remote;

let activateContent;

const mapStateToProps = state => ({
    nodeId: state.info.networkInfo.key,
    version: state.info.version,
    isDeveloperMode: state.input.developerMode,
    isMainNet: state.info.isMainNet,
    concentSwitch: state.concent.concentSwitch
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeContent: null,
            concentModal: false,
            isConcentOn: props.concentSwitch
        };
    }

    componentDidMount() {
        const { actions, nodeId } = this.props;
        actions.showTrust(nodeId);

        this.headerEl = document.getElementById("personal");
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            nextProps.isDeveloperMode != this.props.isDeveloperMode &&
            this.state.activeContent > 3
        ) {
            this.setState({
                activeContent: null
            });
        }

        if (
            nextProps.concentSwitch !== this.props.concentSwitch &&
            !nextProps.concentSwitch
        ) {
            this.setState({
                concentModal: !nextProps.concentSwitch
            });
        }
    }

    /**
     * [_handleTab func. will make selected tab visible in accordion tab system]
     * @param  {DOM}        elm         [Clicked DOM Element]
     */
    _handleTab = elm => {
        let target = elm.currentTarget;
        let targetRoot = target.parentElement;
        let index = targetRoot.getAttribute("value");
        let accordionItems = document.getElementsByClassName("item__accordion");
        for (var i = 0; i < accordionItems.length; i++) {
            if (i !== parseInt(index)) {
                accordionItems[i].classList.remove("active");
                accordionItems[i].children[0].children[1].classList.remove(
                    "arrow-expand"
                );
            }
        }
        targetRoot.classList.toggle("active");
        target.children[1].classList.toggle("arrow-expand");
        this.setState(
            {
                activeContent:
                    this.state.activeContent !== parseInt(index)
                        ? parseInt(index)
                        : null
            },
            () => {
                if (!Number.isInteger(this.state.activeContent)) {
                    this.headerEl.classList.remove("smaller");
                } else {
                    this.headerEl.classList.add("smaller");
                }
            }
        );
    };

    /**
     * [loadAccordionMenu func. will  populate accordion list with given items.]
     * @param  {Array}      data        [List of accordion items]
     * @return {DOM}                    [Elements of accordion list]
     */
    loadAccordionMenu(data) {
        const { isDeveloperMode, isMainNet } = this.props;
        return data
            .filter((_, index) => isDeveloperMode || index < 6)
            .filter(
                (item, _) => !(item.title == "Concent Settings" && isMainNet)
            )
            .map((item, index) => (
                <div
                    className="item__accordion"
                    key={index.toString()}
                    value={index}>
                    <div
                        className="item-title__accordion"
                        onClick={this._handleTab}
                        role="tab"
                        tabIndex="0">
                        <span>{item.title}</span>
                        <span
                            className="icon-arrow-down"
                            aria-label="Expand Tab"
                        />
                    </div>
                    <div className="item-content__accordion" role="tabpanel">
                        {item.content}
                    </div>
                </div>
            ));
    }

    /**
     * [_closeModal funcs. closes modals.]
     */
    _closeModal = (isCancel = false) => {
        this.setState({
            concentModal: false
        });

        if (isCancel) this.props.actions.toggleConcent(true, false);
    };

    /**
     * [_disableConcent will disable concent with optional lock fund feature]
     * @param  {Boolean} isUnlockIncluded [if user wants to unlock the fund, the parameter will be true]
     * @return
     */
    _disableConcent = isUnlockIncluded => {
        this.setState(
            {
                concentModal: false
            },
            () =>
                this.props.actions.toggleConcent(false, true, isUnlockIncluded)
        );
    };

    render() {
        const { version } = this.props;
        const { concentModal } = this.state;
        const accordionItems = [
            {
                title: "Performance",
                content: <Performance />
            },
            {
                title: "Price",
                content: <Price />
            },
            {
                title: "Concent Settings",
                content: <Concent />
            },
            {
                title: "Network Trust",
                content: <Trust />
            },
            {
                title: "Default File Location",
                content: <FileLocation />
            },
            {
                title: "Custom Geth",
                content: <Geth />
            },
            {
                title: "Peers",
                content: <Peers />
            },
            {
                title: "Stats",
                content: <Stats />
            }
        ];

        return (
            <div className="content__settings">
                <Personal />
                <div className="tab__accordion" id="tabAcordion">
                    {this.loadAccordionMenu(accordionItems)}
                </div>
                {concentModal &&
                    ReactDOM.createPortal(
                        <ConcentModal
                            closeModal={this._closeModal}
                            toggleConcentCallback={this._disableConcent}
                        />,
                        document.getElementById("modalPortal")
                    )}
                <div className="footer__settings">
                    <span>
                        {version.error
                            ? version.message
                            : `${version.message}${version.number}`}
                    </span>
                    <br />
                    <span>
                        {`Golem Interface v${__VERSION__}`}
                    </span>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
