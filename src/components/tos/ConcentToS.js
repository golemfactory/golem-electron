import React from 'react';

import termsIcon from './../../assets/img/terms.svg'

export default class ConcentToS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAcceptLocked: true
        }
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
        const {isAcceptLocked } = this.state
        const { concentTerms } = this.props
        return (
            <div className="container__concent-tos">
                <div className="desc__concent-tos">
                    <div className="container__concent-tos" onScroll={::this._handleScroll}>
                        <div id="blurTop" className="blur blur--top"/>
                        <div dangerouslySetInnerHTML={{ __html: concentTerms }}/>
                        <div id="blurBottom" className="blur blur--bottom"/>
                    </div>
                    <span className="info__concent-tos">By clicking Accept, you confirm that you have read and agree to the <strong>user interaction guidelines</strong>, <strong>disclaimer</strong> and <a href="https://golem.network/privacy">privacy policy</a>.</span>
                    <div className="action-container__concent-tos">
                        <span className="btn--cancel">Cancel</span>
                        <button className="btn btn--primary">Accept</button>
                    </div>
                </div>
            </div>
        );
    }
}
