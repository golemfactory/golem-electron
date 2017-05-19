import React from 'react';
import { browserHistory } from 'react-router'


export default class FileCheckModal extends React.Component {


    constructor(props) {
        super(props);
        this._handleCancel = ::this._handleCancel
    }

    componentDidMount() {
        window.applicationSurface.addEventListener('click', this._handleCancel)
    }

    componentWillUnmount() {
        window.applicationSurface.removeEventListener('click', this._handleCancel)
    }

    _handleCancel() {
        this.props.closeModal()
        browserHistory.push('/tasks')
    }

    fetchFiles(files) {
        console.log("FETCH", files)
        return files.map(({name, extension}, index) => <div key={index.toString()}><span>{name}</span></div>)
    }


    render() {
        const {unknownFiles} = this.props
        return (
            <div className="container__modal container__file-check-modal">
                <div className="content__modal">
                    <div className="container-icon">
                        <span className="icon-warning"/>
                    </div>
                    <span>Sorry, but we couldn't recognise some of the files needed for this task. Please check them and try again.</span>
                    <div className="list__file-check-modal">
                    {this.fetchFiles(unknownFiles)}
                    </div>
                </div>
            </div>
        );
    }
}
