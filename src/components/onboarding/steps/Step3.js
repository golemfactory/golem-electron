import React from 'react';
import Lottie from 'react-lottie';

import tasksPreview from './../../../assets/img/tasks-preview.png'
import animData from './../../../assets/anims/onboarding/provider.json'
import SpotLight from '../../SpotLight'

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
                    <Lottie options={defaultOptions}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Start as provider</h1>
                    <span>
                        If your Golem node was properly installed the only 
                        thing you do is allocating the amount of resources 
                        that you want to share with the network.
                        <br/>
                        <br/>
                        If you don't recieve any tasks it only means that
                        currently there is not so many in the network. Be 
                        patient and they will surely appear.
                    </span>
                </div>
            </div>
        )
    }
}
