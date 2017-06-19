import React from 'react';
const {remote} = window.require('electron');
const {BrowserWindow, dialog} = remote
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from './../../actions'

const mapStateToProps = state => ({
    location: state.fileLocation.location
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class FileLocation extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [_handleFolderSelection func. will trigger file chooser dialog window and then update default file location on Redux store]
     */
    _handleFolderSelection() {
        let onFolderHandler = data => {
            if (data) {
                console.log(data)
                this.props.actions.setFileLocation(data[0])
                this.refs.outputPath.value = data[0]
            }
        }

        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, onFolderHandler)
    }

    render() {
        const {location} = this.props
        return (
            <div className="content__file-location">
                <div>
                    <span className="title__file-location">Output Folder</span>
                    <input ref="outputPath" type="text" disabled placeholder="..Docs/Golem/Output" aria-label="Output folder path" value={location}/>
                    <button className="btn--outline" onClick={::this._handleFolderSelection}>Change</button>
                </div>
                <div>
                    <span className="tips__file-location">Output folder is where the returned results of your tasks will go. </span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileLocation)