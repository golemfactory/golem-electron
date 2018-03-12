import React from 'react';

import termsIcon from './../../../assets/img/terms.svg'

export default class Terms extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isTermsAccepted: false
        }
    }

    _handleTypeRadio(){
        this.setState({
            isTermsAccepted: !this.state.isTermsAccepted
        })
    }

    render() {
        const { isTermsAccepted } = this.state
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={termsIcon}/>
                </div>
                <div className="desc__onboarding" onChange={::this._handleTypeRadio}>
                    <span>By clicking Accept, you confirm
                    <br/>
                    that you have read the <a href="">terms and conditions</a>,
                    and that you agree to be bound by them.</span>
                    <br/>
                    <br/>
                    <div className="radio-item">
                        <input id="taskTypeRadio1" type="checkbox" name="taskType" checked={isTermsAccepted} readOnly required/>
                        <label htmlFor="taskTypeRadio1" className="radio-label-left"><u>I want to help Golem by sending my statistic anonymously.</u></label>
                    </div>
                </div>
            </div>
        );
    }
}
