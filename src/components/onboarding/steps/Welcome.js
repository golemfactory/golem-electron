import React from 'react';
import Lottie from 'react-lottie';

import welcomeBeta from './../../../assets/img/welcome-beta.svg'
import animDataTestNet from './../../../assets/anims/onboarding/welcome-testnet.json'
import animDataMainNet from './../../../assets/anims/onboarding/welcome-mainnet.json'

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: null,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Welcome extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {isMainNet} = this.props
        defaultOptions.animationData = isMainNet ? animDataMainNet : animDataTestNet
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <Lottie options={defaultOptions}/>
                </div>
                <div className="desc__onboarding">
                    <h1>You are running {isMainNet ? "mainnet": "testnet"}</h1>
                    <span>That means you will be using tGNT and tETH which are testnet network tokens and do not hold any real value.</span>
                    <br/>
                    <br/>
                    <span>Other than that the app works exactly same and has some experimental functionalities.</span>
                </div>
            </div>
        );
    }
}