import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/Concent01';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Step1 extends React.Component {

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
                      height={400}
                      width={400}
                      isStopped={this.state.isStopped}
                      isPaused={this.state.isPaused}/>
                </div>
                <div className="concent-onboarding__desc">
                    <h2>How does it work?</h2>
                    <span className="concent-info">
                        Using Concent Service you promise ethical behavior in the network by pledging 
                        a small amount of your funds as a Deposit. Concent Service intervenes only when 
                        there is a sign of malicious behavior between the nodes, so you can think of it 
                        as an arbitrator or mediator in the dispute.
                    </span>
                </div>  
            </div>
        );
    }
}
