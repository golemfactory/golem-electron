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
            frameCount: null
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

    _setPreview({id, src, frameCount}) {
        this.setState({
            previewId: id,
            previewSrc: src,
            frameCount
        })
    }

    _handleDeleteModal(deleteId, deleteCallback) {
        this.setState({
            deleteModal: true,
            deleteProps: {
                deleteId,
                deleteCallback
            },

        })
    }

    _closeModal() {
        this.setState({
            deleteModal: false,
        })
    }


    render() {
        const {deleteModal, deleteProps, previewId, previewSrc, frameCount} = this.state
        const {actions, preview, expandedPreview} = this.props

        return (
            <div className="content__task-panel">
                    <div className={`container__task-panel ${preview && 'container__task-panel--with-preview'}`}>
                        <DropZone>
                            <div className="section__table">
                                <Table deleteModalHandler={::this._handleDeleteModal} previewHandler={::this._setPreview}/>
                            </div>
                        </DropZone>
                        {preview && <div className="section__preview">
                             <Preview setPreviewExpanded={actions.setPreviewExpanded} id={previewId} src={previewSrc} frameCount={frameCount}/> 
                        </div>}
                        {deleteModal && <DeleteModal closeModal={::this._closeModal} {...deleteProps}/>}
                    </div>

                    <Footer {...this.props}/>
                </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel)
