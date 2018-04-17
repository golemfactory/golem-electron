import React from 'react';

import avatar from './../../../assets/img/avatar.svg'

export default class Step2 extends React.Component {

    constructor(props) {
        super(props);
    }

    _setNodeName(e) {
        return this.props.setNodeName(e.target.value)
    }

    componentDidMount() {
        setTimeout(() => document.getElementById('nickInput').focus(), 600) //CSSTransition issue related
        document.getElementById("nickInput").value = this.props.nodeName || ""
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding">
                    <img className="avatar" src={avatar}/>
                    <form 
                        ref={(ref) => this.nodeNameForm = ref}
                        id="nodeNameForm"
                        name="nodeNameForm"
                        className="nickname-area__onboarding"
                        onSubmit={::this.props.handleNext}>
                        <input 
                            id="nickInput" 
                            className="nickname-input__onboarding" 
                            placeholder="Anonymous Golem" 
                            onChange={::this._setNodeName} 
                            maxLength={16}
                            pattern="^\S+(?: \S+)*$"
                            required/>
                        <button style={{display: 'none'}} type='submit' ref={ (button) => { this.activityFormButton = button } } >Submit</button>
                    </form>
                </div>
                <div className="desc__onboarding">
                    <span>Please name your node.
                    <br/>Adding an avatar is optional, but can help
                    <br/>to build trust, an important part 
                    <br/>of the Golem system.</span>
                </div>
            </div>
        )
    }
}
