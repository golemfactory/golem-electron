import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/Concent02';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Step3 extends React.Component {

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
                    <h2>Where is deposit?</h2>
                    <span className="concent-info">
                        If you want to know what is the current value of your Deposit just toggle the view in "Latest transactions" widget.
                        <br/>
                        <br/>
                        You can always adjust this view to your needs.
                    </span>
                </div>  
            </div>
        );
    }
}
