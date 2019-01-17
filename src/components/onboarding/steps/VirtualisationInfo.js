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
                    We have detected that Virtualisation on your machine <br/>
                    is disabled. Vt-X/AMD-v needs to be ennabled in BIOS <br/>
                    as it is mandatory to run Golem. If you want to know <br/>
                    how to enable it, please follow this <a href="https://golem.network/documentation/how-to-enable-vt-x-in-bios/#enabling-virtualization-in-bios-required-for-windows-users">instructions</a>
                    </span>
                </div>  
            </div>
        );
    }
}
