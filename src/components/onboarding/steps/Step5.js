import React from 'react';
import Lottie from 'react-lottie';

import avatar from './../../../assets/img/avatar.svg'
import animData from './../../../assets/anims/onboarding/node-name.json'

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Step5 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isStopped: false, 
            isPaused: false
        };
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
                    <Lottie options={defaultOptions}
                      isStopped={this.state.isStopped}
                      isPaused={this.state.isPaused}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Name your node</h1>
                    <span>
                        You will be able to change your node name later on inside the app settings.
                    </span>
                    <form 
                        ref={(ref) => this.nodeNameForm = ref}
                        id="nodeNameForm"
                        name="nodeNameForm"
                        className="nickname-area__onboarding"
                        onSubmit={::this.props.handleNext}>
                        <input 
                            id="nickInput" 
                            className="nickname-input__onboarding" 
                            placeholder="Name your node" 
                            onChange={::this._setNodeName} 
                            maxLength={16}
                            pattern="^\S+(?: \S+)*$"
                            required/>
                        <button style={{display: 'none'}} type='submit' ref={ (button) => { this.activityFormButton = button } } >Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}
