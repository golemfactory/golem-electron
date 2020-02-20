import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/Concent04';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Step4 extends React.Component {

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
                    <h2>More tasks in the network</h2>
                    <span className="concent-info">
                        When acting as a Provider, by default your node will accept all the tasks within the network (those with Concent and those without it).
                        <br/>
                        <br/>
                        If you want to compute exclusively Concent tasks go to your Concent settings and set the switch that allows your node to take up all kinds of tasks to "OFF" position.
                    </span>
                </div>  
            </div>
        );
    }
}
