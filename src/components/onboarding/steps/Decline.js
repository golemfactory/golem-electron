import React from 'react';
import Lottie from 'react-lottie';

import animData from './../../../assets/anims/onboarding/terms-are-you-sure.json'

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class Decline extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <Lottie options={defaultOptions}/>
                </div>
                <div className="desc__onboarding">
                    <span>Are you sure you want to leave Golem without trying?
                    <br/>
                    We hope you consider your decision, if not, 
                    <br/>
                    come back soon!
                    </span>
                </div>  
            </div>
        );
    }
}
