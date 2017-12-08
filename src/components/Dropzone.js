import React from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'

import * as Actions from './../actions'
const {remote} = window.electron;
const {BrowserWindow, dialog} = remote
const mainProcess = remote.require('./index')


const ADD_TASK_NEXT_STEP = '/add-task/type'

const classDict = Object.freeze({
    SHOW: 'drop-zone--show',
    HIDE: 'drop-zone--hide'
})

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    taskList: state.realTime.taskList,
    fileCheckModal: state.info.fileCheckModal
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

/**
 * { Re-usable DropZone component }
 * @doc: http://codepen.io/jzmmm/pen/bZjzxN?editors=0011 
 */
export class DropZone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className: (props.taskList && props.taskList.length) > 0 ? classDict.HIDE : classDict.SHOW
        }
        this._onDragEnter = ::this._onDragEnter
        this._onDragLeave = ::this._onDragLeave
        this._onDragOver = ::this._onDragOver
        this._onDrop = ::this._onDrop
        this.traverseFileTree = :: this.traverseFileTree
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.taskList && (nextProps.taskList.length !== this.props.taskList.length))
            this.setState({
                className: nextProps.taskList.length > 0 ? classDict.HIDE : classDict.SHOW
            })
    }

    componentDidMount() {
        const {dropzone, dragbox, infobox} = this.refs

        dropzone.addEventListener('mouseup', this._onDragLeave);
        dropzone.addEventListener('dragenter', this._onDragEnter);
        dropzone.addEventListener('dragover', this._onDragOver);

        if(dragbox){
            dragbox.addEventListener('dragleave', this._onDragLeave);
            dropzone.addEventListener('drop', this._onDrop.bind(this._onDrop, false));
        } else {
            infobox.addEventListener('dragleave', this._onDragLeave);
            dropzone.addEventListener('drop', this._onDrop.bind(this._onDrop, true));
        }
    }

    componentWillUnmount() {
        const {dropzone, dragbox, infobox} = this.refs

        dropzone.removeEventListener('mouseup', this._onDragLeave);
        dropzone.removeEventListener('dragenter', this._onDragEnter);
        dropzone.addEventListener('dragover', this._onDragOver);
        dropzone.removeEventListener('drop', this._onDrop);

        if(dragbox){
            dragbox.removeEventListener('dragleave', this._onDragLeave);
        } else {
            infobox.removeEventListener('dragleave', this._onDragLeave);
        }
    }

    /**
     * [_onDragEnter function]
     * @param       {Object}    e   [event]
     * @return      {boolean} 
     */
    _onDragEnter(e) {
        this.setState({
            className: classDict.SHOW
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
            className: this.props.taskList.length > 0 ? classDict.HIDE : classDict.SHOW
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
    _onDrop(info = false, e) {
        e.preventDefault();

        if(info){ // in case of golem not connected
            e.stopPropagation();

            this.setState({
                className: this.props.taskList.length > 0 ? classDict.HIDE : classDict.SHOW
            });

            return false;
        }

        /**
         * [checkDominantType function checks common item in given array, if there's one common returns it, if more than one with equal amounts returns negative boolean]
         * @param  {[type]}      files      [Array of extension]
         * @return {Any}                    [Common item or negative boolean]
         */
        const checkDominantType = function(files) {
            const isBiggerThanOther = function(element, index, array) {
                return element[1] !== array[0][1];
            }
            const tempFiles = [...files.reduce((total, current) => total.set(current, (total.get(current) || 0) + 1), new Map)]
            const anyDominant = tempFiles.some(isBiggerThanOther)

            if (!anyDominant && tempFiles.length > 1) {
                return false
            } else {
                return tempFiles
                    .sort((a, b) => b[1] - a[1])
                    .map(item => item[0])[0];
            }
        }

        let files = e.dataTransfer.files;
        //console.log('Files dropped: ', files.length);
        // Upload files
        // actions.uploadFile(files)
        if (files) {

            mainProcess.selectDirectory([].map.call(files, item => item.path))
                .then(item => {
                    let mergedList = [].concat.apply([], item);
                    let unknownFiles = mergedList.filter(({malicious}) => (malicious));
                    let masterFiles = mergedList.filter(({master}) => (master));
                    let dominantFileType = checkDominantType(masterFiles.map(file => file.extension));
                    //console.log("masterFiles", masterFiles);
                    (masterFiles.length > 0 || unknownFiles.length > 0) && hashHistory.push(`/add-task/type${!!dominantFileType ? `/${dominantFileType.substring(1)}` : ''}`)
                    if (unknownFiles.length > 0) {
                        this.props.actions.setFileCheck({
                            status: true,
                            files: unknownFiles
                        })
                    } else if (masterFiles.length > 0) {
                        this.props.actions.createTask({
                            resources: mergedList.map(item => item.path)
                        })
                    } else {
                        alert("There's no main file! There should be at least one blender or luxrender file.")
                    }
                })
        }

        // for (var i = 0; i < files.length; i++) {
        //     // webkitGetAsEntry is where the magic happens
        //     var item = files[i].webkitGetAsEntry();
        //     if (item) {
        //         this.traverseFileTree(item);
        //     }
        // }

        this.setState({
            className: classDict.HIDE
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
                //console.log("File:", path, file.path);
                /*actions.uploadFile({
                    path,
                    file
                })*/
            });
        } else if (item.isDirectory) {
            // Get folder contents
            var dirReader = item.createReader();
            let done = false;
            /**
             * [readFiles funct. reads files from dragged folder]
             * @param  {[Object]}   dirReader   [File Reader form directory]
             * @param  {[Array]}    (entries    [File Array]
             * @return nothing
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
             * @see http://stackoverflow.com/a/23823587/1763249 
             *
             * @description readEntries file read limit is 100 item, so we're calling same function till array length is 0
             */
            let readFiles = dirReader.readEntries.bind(dirReader, (entries) => {

                //console.log('Entries length: ', entries.length)
                for (var i = 0; i < entries.length; i++) {
                    this.traverseFileTree(entries[i], path + item.name + "/")
                }
                if (entries.length > 0) {
                    readFiles(); // TODO we need to add a file length limit here cuz right now users can drag infinitve numbers of files.
                }
            })
            readFiles();
        }
    }



    render() {
        const {isEngineOn} = this.props
        return (
            <div ref="dropzone" className="drop-zone">
                {this.props.children}
                { isEngineOn ?
                    <div ref="dragbox" className={this.state.className}>
                        <p><span className="icon-upload"/></p>
                        <span>Drop files here to create a new task</span>
                        <p className="tips__drop-zone">You can also click <b>+</b> above to create a task and browse for your files.</p>
                    </div>
                    :
                    <div ref="infobox" className={`${this.state.className} no-drop`}>
                        <div className="container-icon">
                            <span className="icon-warning"/>
                        </div>
                        <span>Before drop your files, golem needs to be started.</span>
                    </div>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropZone)