import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/onboarding/requestor.json';

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
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding section__fixed">
                    <Lottie options={defaultOptions} />
                </div>
                <div className="desc__onboarding">
                    <h1>Become a requestor</h1>
                    <span>
                        After topping up your wallet you just drag & drop your
                        files and adjust your task settings before sending them
                        to the network.
                    </span>
                </div>
            </div>
        );
    }
}
