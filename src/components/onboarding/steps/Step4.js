import React from 'react';
import Lottie from 'react-lottie';

import docPreview from './../../../assets/img/doc-preview.png'
import animData from './../../../assets/anims/onboarding/requestor.json'
import SpotLight from '../../SpotLight'

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
            <div className="container-step__onboarding">
                <div className="section-image__onboarding section__fixed">
                    <Lottie options={defaultOptions}
                      isStopped={this.state.isStopped}
                      isPaused={this.state.isPaused}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Become a requestor</h1>
                    <span>
                        In order to commission tasks to the network you will 
                        need GNT and ETH. After toping up your wallet, you just
                        drag & drop your files and after adjusting your task 
                        settings send them to the network.
                    </span>
                </div>
            </div>
        );
    }
}
