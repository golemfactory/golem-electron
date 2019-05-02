import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/onboarding/provider.json';

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
                    <Lottie options={defaultOptions} />
                </div>
                <div className="desc__onboarding">
                    <h1>Start as a provider</h1>
                    <span>
                        If your Golem node was properly installed the only thing
                        you need to do is allocate your desired amount of
                        resources to share with the network.
                        <br />
                        <br />
                        Keep in mind that network traffic varies so if you do
                        not receive tasks right away, be patient and some will
                        surely appear over time.
                    </span>
                </div>
            </div>
        );
    }
}
