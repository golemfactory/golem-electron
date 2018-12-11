import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

import Personal from './Personal'
import Performance from './Performance'
import Price from './Price'
import Concent from './Concent'
import ConcentModal from './modal/ConcentModal'
import Trust from './Trust'
import FileLocation from './FileLocation'
import Geth from './Geth'
import Stats from './Stats'
import Peers from './Peers'
import { APP_VERSION } from './../../main'

const {remote} = window.electron;
const {dialog} = remote
const versionGUI = remote.app.getVersion();

let activateContent


const mapStateToProps = state => ({
    nodeId: state.info.networkInfo.key,
    version: state.info.version,
    isDeveloperMode: state.input.developerMode
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeContent: null,
            concentModal: false,
            isConcentOn: false
        }
    }

    componentDidMount() {
        const {actions, nodeId} = this.props
        actions.showTrust(nodeId)

         this.headerEl = document.getElementById('personal');
        // const resizeHeaderOnScroll = () => {
        //     const elementY = document.getElementById('tabAcordion'),
        //     shrinkOn = 0;
        //     if (elementY.scrollTop > shrinkOn && Number.isInteger(this.state.activeContent)) {
        //         this.headerEl.classList.add("smaller");
        //     } else if(!Number.isInteger(this.state.activeContent)) {
        //         this.headerEl.classList.remove("smaller");
        //     }
        // }

        // window.addEventListener('scroll', resizeHeaderOnScroll, true);
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.isDeveloperMode != this.props.isDeveloperMode && this.state.activeContent > 3){
            this.setState({
                activeContent: null
            })
        }
    }

    /**
     * [_handleTab func. will make selected tab visible in accordion tab system]
     * @param  {DOM}        elm         [Clicked DOM Element]
     */
    _handleTab(elm) {
        let target = elm.currentTarget
        let targetRoot = target.parentElement
        let index = targetRoot.getAttribute('value')
        let accordionItems = document.getElementsByClassName('item__accordion')
        for (var i = 0; i < accordionItems.length; i++) {
            if (i !== parseInt(index)) {
                accordionItems[i].classList.remove('active')
                accordionItems[i].children[0].children[1].classList.remove('arrow-expand')
            }
        }
        targetRoot.classList.toggle('active')
        target.children[1].classList.toggle('arrow-expand')
        this.setState({
            activeContent: this.state.activeContent !== parseInt(index) ? parseInt(index) : null
        },() => {
            if(!Number.isInteger(this.state.activeContent)){
                this.headerEl.classList.remove("smaller")
            } else {
                this.headerEl.classList.add("smaller")
            }
        })
    }

    /**
     * [loadAccordionMenu func. will  populate accordion list with given items.]
     * @param  {Array}      data        [List of accordion items]
     * @return {DOM}                    [Elements of accordion list]
     */
    loadAccordionMenu(data) {
        const {isDeveloperMode} = this.props
        return data
        .filter((_, index) => isDeveloperMode || index < 6)
        .map((item, index) => <div className="item__accordion" key={index.toString()} value={index}>
                        <div className="item-title__accordion" onClick={::this._handleTab} role="tab" tabIndex="0">
                            <span>{item.title}</span>
                            <span className="icon-arrow-down" aria-label="Expand Tab"/>
                        </div>
                        <div className="item-content__accordion" role="tabpanel">
                        {item.content}
                        </div>
                    </div>)
    }

    /**
     * [_closeModal funcs. closes modals.]
     */
    _closeModal = (isCancel = false) => {
        this.setState({
            concentModal: false
        })

        if(isCancel)
            this.setState({
                isConcentOn: true
            })
    }

    _toggleConcentSwitch = (isConcentOn) => {

        if(!isConcentOn)
            this.setState({
                concentModal: true
            })

        this.setState({
            isConcentOn
        })
        //this.props.actions.toggleConcent(this.state.isConcentOn)
    }

    render() {
        const {version} = this.props
        const {concentModal, isConcentOn} = this.state
        const accordionItems = [
            {
                title: 'Performance',
                content: <Performance/>
            },
            {
                title: 'Price',
                content: <Price/>
            },
            {
                title: 'Concent Settings',
                content: <Concent toggleConcentSwitch={this._toggleConcentSwitch} isConcentOn={isConcentOn}/>
            },
            {
                title: 'Network Trust',
                content: <Trust/>
            },
            {
                title: 'Default File Location',
                content: <FileLocation/>
            },
            {
                title: 'Custom Geth',
                content: <Geth/>
            },
            {
                title: "Peers",
                content: <Peers/>
            },
            {
                title: "Stats",
                content: <Stats/>
            }
        ]

        return (
            <div className="content__settings">
                <Personal/>
                <div className="tab__accordion" id="tabAcordion">
                    { this.loadAccordionMenu(accordionItems)}
                </div>
                {concentModal && <ConcentModal closeModal={this._closeModal}/>}
                <div className="footer__settings">
                    <span>{version.error ? version.message : `${version.message}${version.number}`}</span>
                    <br/>
                    <span>{versionGUI && `Golem Interface v${versionGUI}`}</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
