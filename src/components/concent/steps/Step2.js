import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/Concent03';

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Step2 extends React.Component {

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
                    <h2>How to use it?</h2>
                    <span className="concent-info">
                        All transactions in Concent Service are done on users behalf, so besides turning it on, there is no other action required. However Concent Service will require both GNT and ETH in order to create the deposit.
                        <br/>
                        <br/>
                        You can always adjust this view to your needs.
                    </span>
                </div>  
            </div>
        );
    }
}
