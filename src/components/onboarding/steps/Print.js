import React from 'react';
import Lottie from 'react-lottie';

import printIcon from './../../../assets/img/print.svg'
import animData from './../../../assets/anims/onboarding/printer.json'

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Print extends React.Component {

    constructor(props) {
        super(props);
    }


    _initContent(_isPrinted, _isSkippingPrint){
        if(!_isSkippingPrint || _isPrinted){
            if(!_isPrinted){
                return <span>We do care about your safety!
                        <br/>
                        So just to be sure that you actually have your password
                        <br/>
                        saved, please write it down in a safe place.
                        <br/>
                        You can also print it out or save it as PDF file.
                        </span>
            }

            return <span>
                        Security guidelines.
                        <br/>
                        After printing your password, delete
                        <br/>
                        the PDF and temporary files from your machine. You can also
                        <br/>
                        encrypt the PDF file with password and store it in
                        <br/>
                        secure place, like a USB drive.
                        </span>
        } 
        return <span>
                        Hey!
                        <br/>
                        Are you sure that you don't want to print your
                        <br/>
                        password? We hope that you have written it down and
                        <br/>
                        stored it in a safe and secure place!
                        </span>
    }

    render() {
        const { isPrinted, isSkippingPrint } = this.props
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <Lottie options={defaultOptions}/>
                </div>
                <div className="desc__onboarding">
                    {this._initContent(isPrinted, isSkippingPrint)}
                </div>  
            </div>
        );
    }
}
