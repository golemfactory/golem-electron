import React from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../actions'
/**
 * { Re-usable DropZone component }
 * @doc: http://codepen.io/jzmmm/pen/bZjzxN?editors=0011 
 */

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class DropZone extends React.Component {
    constructor() {
        super();
        this.state = {
            className: 'drop-zone--hide'
        }
        this._onDragEnter = ::this._onDragEnter
        this._onDragLeave = ::this._onDragLeave
        this._onDragOver = ::this._onDragOver
        this._onDrop = ::this._onDrop
        this.traverseFileTree = :: this.traverseFileTree
    }

    componentDidMount() {
        let dropzone = this.refs.dropzone
        let dragbox = this.refs.dragbox
        dropzone.addEventListener('mouseup', this._onDragLeave);
        dropzone.addEventListener('dragenter', this._onDragEnter);
        dropzone.addEventListener('dragover', this._onDragOver);
        dragbox.addEventListener('dragleave', this._onDragLeave);
        dropzone.addEventListener('drop', this._onDrop);
    }

    componentWillUnmount() {
        let dropzone = this.refs.dropzone
        let dragbox = this.refs.dragbox
        dropzone.removeEventListener('mouseup', this._onDragLeave);
        dropzone.removeEventListener('dragenter', this._onDragEnter);
        dropzone.addEventListener('dragover', this._onDragOver);
        dragbox.removeEventListener('dragleave', this._onDragLeave);
        dropzone.removeEventListener('drop', this._onDrop);
    }

    /**
     * [_onDragEnter function]
     * @param       {Object}    e   [event]
     * @return      {boolean} 
     */
    _onDragEnter(e) {
        this.setState({
            className: 'drop-zone--show'
        });
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    /**
     * [_onDragOver function]
     * @param       {Object}    e  [event]
     * @return      {boolean} 
     */
    _onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    /**
     * [_onDragLeave fuction]
     * @param       {Object}    e   [event]
     * @return      {boolean}   
     */
    _onDragLeave(e) {
        this.setState({
            className: 'drop-zone--hide'
        });
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    /**
     * [_onDrop function]
     * @param       {Object}    e   [event]
     * @return      {boolean}
     */
    _onDrop(e) {
        e.preventDefault();
        let files = e.dataTransfer.items;
        console.log('Files dropped: ', files);
        // Upload files
        // actions.uploadFile(files)

        for (var i = 0; i < files.length; i++) {
            // webkitGetAsEntry is where the magic happens
            var item = files[i].webkitGetAsEntry();
            if (item) {
                this.traverseFileTree(item);
            }
        }

        this.setState({
            className: 'drop-zone--hide'
        });
        return false;
    }

    /**
     * { traverseFileTree function }
     * @param  {[File]}         item        [File Object]
     * @param  {[String]}       path        [Path of the file in filetree]
     * @return nothing
     */
    traverseFileTree(item, path) {
        const {actions} = this.props
        path = path || "";
        if (item.isFile) {
            // Get file
            item.file(function(file) {
                //file.name = path + file.name;
                console.log("File:", path, file);
                actions.uploadFile({
                    path,
                    file
                })
            });
        } else if (item.isDirectory) {
            // Get folder contents
            var dirReader = item.createReader();
            dirReader.readEntries((entries) => {
                for (var i = 0; i < entries.length; i++) {
                    this.traverseFileTree(entries[i], path + item.name + "/");
                }
            });
        }
    }



    render() {
        return (
            <div ref="dropzone" className="drop-zone">
                {this.props.children}
                <div ref="dragbox" className={this.state.className}>
                    <p><span className="icon-upload"/></p>
                    <span>Drop files here to create a new task</span>
                    <p className="tips__drop-zone">You can also click <b>+</b> above to create a task and browse for your files.</p>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropZone)