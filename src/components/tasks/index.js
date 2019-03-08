import React from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

import Table from './Table'
import Preview from './Preview'
import Frame from './frame'
import DropZone from './../Dropzone'
import TransactionTube from '../transaction'
import History from '../History'
import Wallet from '../wallet'
import DeleteModal from './modal/DeleteModal'
import RestartModal from './modal/RestartModal'
import FooterMain from './../FooterMain'

const mapStateToProps = state => ({
    balance: state.realTime.balance,
    currency: state.currency,
    preview: state.input.preview,
    expandedPreview: state.input.expandedPreview,
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

/**
 * { Class for TaskPanel component. }
 *
 * @class      TaskPanel (name)
 */
export class TaskPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deleteModal: false,
            deleteCallback: null,
            deleteProps: null,
            restartModal: false,
            restartCallback: null,
            restartProps: null,
            previewId: null,
            previewSrc: null,
            isWalletTray: false,
            toggleHistory: false
        }
    }


    componentDidMount() {
        const {actions} = this.props
        const endLoading = () => {
            actions.endLoading("TASK_PANEL_LOADER")
        /*Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key]
        })*/
        }
        actions.startLoading("TASK_PANEL_LOADER", "I am loading!")
        setTimeout(endLoading, 3000)
    }


    componentWillUnmount() {
        this.props.actions.updatePreviewLock({
            enabled: false,
            id: null,
            frameCount: null
        })
    }

    /**
     * [_setPreview func. update related states to present preview]
     * @param {Any}         options.id         [Id of selected task]
     * @param {String}      options.src        [Preview url of selected task]
     */
    _setPreview({id, src}) {
        this.setState({
            previewId: id,
            previewSrc: src
        })
    }

    /**
     * [_handleDeleteModal func. makes  delete modal visible]
     * @param  {[type]} deleteId       [Id of selected task]
     * @param  {[type]} deleteCallback
     */
    _handleDeleteModal(deleteId, deleteCallback) {
        this.setState({
            deleteModal: true,
            deleteProps: {
                deleteId,
                deleteCallback
            },

        })
    }

    /**
     * [_handleRestartModal func. makes  restart modal visible]
     * @param  {[type]} restartId       [Id of selected task]
     * @param  {[type]} restartCallback
     */
    _handleRestartModal(restartId, status, restartCallback) {
        this.setState({
            restartModal: true,
            restartProps: {
                restartId,
                status,
                restartCallback
            },

        })
    }

    /**
     * [_closeModal funcs. closes modals.]
     */
    _closeModal() {
        this.setState({
            deleteModal: false,
            restartModal: false
        })
    }


_toggleWalletTray(toggle){
    this.setState({
        isWalletTray: toggle
    })
}

_toggleTransactionHistory = () => {
    this.setState({
        toggleHistory: !this.state.toggleHistory
    })
}

// {preview && <div className="section__preview">
//                         <Preview id={previewId} src={previewSrc}/> 
//                     </div>}
//                    <Footer {...this.props}  setPreviewExpanded={actions.setPreviewExpanded}/>
                     
    render() {
        const {deleteModal, restartModal, deleteProps, restartProps, previewId, previewSrc, frameCount, psEnabled, isWalletTray, toggleHistory} = this.state
        const {actions, preview, expandedPreview, balance, currency} = this.props

        return (
            <div className="content__task-panel">
                    { !isWalletTray && <Wallet balance={balance} currency={currency}/> }
                    <TransactionTube toggleTransactionHistory={this._toggleTransactionHistory}/>
                    {!toggleHistory
                        ? <div className={`container__task-panel ${preview && 'container__task-panel--with-preview'}`} ref={node => this.overflowTaskList = node}>
                            <DropZone overflowRef={this.overflowTaskList}>
                                <div className="section__table">
                                    <Table 
                                        deleteModalHandler={::this._handleDeleteModal} 
                                        restartModalHandler={::this._handleRestartModal} 
                                        previewHandler={::this._setPreview} 
                                        previewId={previewId} 
                                        toggleWalletTray={::this._toggleWalletTray}/>
                                </div>
                            </DropZone>
                          </div>
                        : <History toggleTransactionHistory={this._toggleTransactionHistory}/> 
                    }
                    
                    {deleteModal
                        && ReactDOM.createPortal(
                            <DeleteModal closeModal={::this._closeModal} {...deleteProps}/>,
                            document.getElementById("modalPortal")
                            )}
                    {restartModal
                        && ReactDOM.createPortal(
                            <RestartModal closeModal={::this._closeModal} {...restartProps}/>,
                            document.getElementById("modalPortal")
                            )}
                    <FooterMain/>
                </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel)
