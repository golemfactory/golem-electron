import React from 'react';

import printIcon from './../../../assets/img/print.svg'

export default class Print extends React.Component {

    constructor(props) {
        super(props);
    }


    _initContent(_isPrinted, _isSkippingPrint){
        if(!_isSkippingPrint){
            if(!_isPrinted){
                return <span className="desc__print">We do care about your safety!
                        <br/>
                        So just to be sure that you actually
                        <br/>
                        have your password saved, please save
                        <br/>
                        it as a PDF file or just print it out.
                        </span>
            }

            return <span className="desc__print">
                        <strong>Security guidelines.</strong>
                        <br/>
                        After printing your password, <strong>delete</strong>
                        <br/>
                        <strong>.pdf and temporary files from your machine.</strong>
                        <br/>
                        <strong>You can also encrypt .pdf file with password</strong>
                        <br/>
                        and <strong>store it in secure place</strong>, like USB drive.
                        </span>
        } 
        return <span className="desc__print">
                        Hey!
                        <br/>
                        Are you sure that you don't want
                        <br/>
                        to print your password? We hope
                        <br/>
                        that you have written it down in a safe
                        <br/>
                        and secure place.
                        </span>
    }

    render() {
        const { isPrinted, isSkippingPrint } = this.props
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={printIcon}/>
                </div>
                <div className="desc__onboarding">
                    {this._initContent(isPrinted, isSkippingPrint)}
                </div>  
            </div>
        );
    }
}
