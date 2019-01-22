import React from 'react';
import Lottie from 'react-lottie';

import networkPreview from './../../../assets/img/network-preview.png'
import animData from './../../../assets/anims/onboarding/setup-ports.json'
import SpotLight from '../../SpotLight'

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
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding section__fixed">
                    <Lottie options={defaultOptions}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Connecting to network</h1>
                    <span>
                        Please make sure that your computer has a public IP or forwarded ports 40102, 40103, 3282.
                        Otherwise you may not be able to run Golem node properly.
                        <br/>
                        <br/>
                        If you don't know how to do it please follow this <a href="https://golem.network/documentation/09-common-issues-troubleshooting/port-forwarding-connection-errors/#getting-started">instructions</a>.
                    </span>
                </div>
            </div>
        )
    }
}
