import React from 'react';
import Lottie from 'react-lottie';

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
                    {isMainNet
                        ? <span>Take care when setting prices and depositing GNT or ETH for use in the app.</span>
                        : <span>That means you will be using tGNT and tETH which are testnet network tokens and do not hold any real value.</span>
                    }
                    <br/>
                    <br/>
                    {isMainNet
                        ? <span>In the cryptoworld, there is no reversing transactions. If you lose GNT because you sent it to the wrong address you cannot get it back.</span>
                        : <span>The testnet app works the same as our mainnet app in all other aspects. Happy testing!</span>}
                </div>
            </div>
        );
    }
}