import React from 'react';

import tasksPreview from './../../../assets/img/tasks-preview.png'
import SpotLight from '../../SpotLight'

export default class Step3 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding section__fixed">
                    <img src={tasksPreview}/>
                    <SpotLight posX={[10, 37]} posY={[18, 18]} r={[10, 10]}/>
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
