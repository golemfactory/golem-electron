import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/warning';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


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

    /**
     * [_handleCancel func. closes modal and redirects to task screen]
     */
    _handleCancel() {
        this.props.closeModal()
        window.routerHistory.push('/tasks')
    }

    /**
     * [fetchFiles funcs. populate unknown file list into modal]
     * @param  {Array}      files       [List of unknown files]
     * @return {DOM}                    [List of unknown file elements]
     */
    fetchFiles(files) {
        return files.map(({name, extension}, index) => <div key={index.toString()}><span>{name}</span></div>)
    }


    render() {
        const {unknownFiles} = this.props
        return (
            <div className="container__modal container__file-check-modal">
                <div className="content__modal">
                    <div className="image-container">
                        <Lottie options={defaultOptions}/>
                    </div>
                    <span className="description">Sorry, but we couldn't recognise some of the files needed for this task. Please check them and try again.</span>
                    <div className="list__file-check-modal">
                    {this.fetchFiles(unknownFiles)}
                    </div>
                </div>
            </div>
        );
    }
}
