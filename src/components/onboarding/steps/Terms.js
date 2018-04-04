import React from 'react';

import termsIcon from './../../../assets/img/terms.svg'

export default class Terms extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isTermsAccepted: false,
            isAcceptLocked: true
        }
    }

    _handleTypeRadio(){
        this.setState({
            isTermsAccepted: !this.state.isTermsAccepted
        })
    }

    _handleScroll(e){
        if(e.target.scrollTop){
            const _ratio = e.target.scrollTop / (e.target.scrollHeight - 220) // 220 is the offset
            document.getElementById('blurTop').style.opacity = _ratio;
            document.getElementById('blurBottom').style.opacity = 1 - _ratio;

            if(e.target.scrollTop > (e.target.scrollHeight - 250)){
                this.props.handleLock(false)
            } else {
                this.props.handleLock(true)
            }
        }
        
    }

    render() {
        const { isTermsAccepted, isAcceptLocked } = this.state
        const { terms } = this.props
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={termsIcon}/>
                </div>
                <div className="desc__onboarding" onChange={::this._handleTypeRadio}>
                    <div className="container__terms" onScroll={::this._handleScroll}>
                        <div id="blurTop" className="blur blur--top"/>
                        <div dangerouslySetInnerHTML={{ __html: terms }}/>
                        <div id="blurBottom" className="blur blur--bottom"/>
                    </div>
                    <span className="info__terms">By clicking Accept, you confirm that you have read the <strong>user interaction guidelines</strong> and <strong>disclaimer</strong> and that you agree to be bound by them.</span>
                    <div className="radio-item">
                        <input id="taskTypeRadio1" type="checkbox" name="taskType" checked={isTermsAccepted} readOnly required/>
                        <label htmlFor="taskTypeRadio1" className="radio-label-left">I want to help Golem by sending my statistic <a href="https://github.com/golemfactory/golem/wiki/FAQ#what-data-do-i-share-with-golem">anonymously</a>.</label>
                    </div>
                </div>
            </div>
        );
    }
}
