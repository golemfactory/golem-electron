import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/Concent05';

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

    render() {
        return (
            <div className="concent-onboarding__container-step">
                <div className="concent-onboarding__section-image">
                   <Lottie options={defaultOptions}
                      isStopped={this.state.isStopped}
                      isPaused={this.state.isPaused}/>
                </div>
                <div className="concent-onboarding__desc">
                    <h2>FAQ</h2>
                    <span className="concent-info">
                        If you have any more questions regarding Concent Service and it's usage, please head over to our <a href="https://docs.golem.network/#/Products/Brass-Beta/Usage?id=concent-service">docs</a>, where we try to answer most of the questions you might have.
                        <br/>
                        <br/>
                        You can also talk with us via <a href="https://chat.golem.network">chat</a>.
                    </span>
                </div>  
            </div>
        );
    }
}
