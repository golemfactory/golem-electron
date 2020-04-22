import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/onboarding/vt-x-windows.json'

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class VirtualisationInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {isMainNet} = this.props
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <Lottie options={defaultOptions}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Virtualisation is required</h1>
                    <span>
                    We have detected that virtualisation may be disabled <br/>
                    on your machine. Virtualisation is required in order <br/>
                    to run Golem. Please make sure that this option is <br/>
                    enabled in BIOS. If you'd like to know how to enable it, <br/>
                    please follow these <a href="https://docs.golem.network/#/Products/Clay-Beta/Issues-&-Troubleshooting?id=enabling-virtualization-in-bios">instructions</a>.
                    </span>
                </div>  
            </div>
        );
    }
}
