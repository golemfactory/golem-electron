import React from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions'

import Table from './Table'
import Preview from './Preview'
import Frame from './frame'
import DropZone from './../Dropzone'
import DeleteModal from './modal/DeleteModal'
import Footer from './../Footer'

const mapStateToProps = state => ({
    preview: state.input.preview,
    expandedPreview: state.input.expandedPreview
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
            previewId: null,
            previewSrc: null,
            frameCount: null,
            psEnabled: false
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

    /**
     * [_setPreview func. update related states to present preview]
     * @param {Any}         options.id         [Id of selected task]
     * @param {String}      options.src        [Preview url of selected task]
     * @param {Number}      options.frameCount [Frame amount of selected task]
     */
    _setPreview({id, src, frameCount, psEnabled}) {
        this.setState({
            previewId: id,
            previewSrc: src,
            frameCount,
            psEnabled
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
     * [_closeModal funcs. closes modals.]
     */
    _closeModal() {
        this.setState({
            deleteModal: false,
        })
    }


    render() {
        const {deleteModal, deleteProps, previewId, previewSrc, frameCount, psEnabled} = this.state
        const {actions, preview, expandedPreview} = this.props

        return (
            <div className="content__task-panel">
                    <div className={`container__task-panel ${preview && 'container__task-panel--with-preview'}`}>
                        <DropZone>
                            <div className="section__table">
                                <Table deleteModalHandler={::this._handleDeleteModal} previewHandler={::this._setPreview}/>
                            </div>
                        </DropZone>
                        {deleteModal && <DeleteModal closeModal={::this._closeModal} {...deleteProps}/>}
                    </div>
                    {preview && <div className="section__preview">
                        <Preview id={previewId} src={previewSrc}/> 
                    </div>}
                    <Footer {...this.props} id={previewId} frameCount={frameCount} setPreviewExpanded={actions.setPreviewExpanded} psEnabled={psEnabled}/>
                </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel)
