import React from 'react';

import networkPreview from './../../../assets/img/network-preview.png'
import SpotLight from '../../SpotLight'

export default class Step2 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding section__fixed">
                    <img src={networkPreview}/>
                    <SpotLight posX={[300, 20]} posY={[300, 20]} r={[50, 10]}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Connecting to network</h1>
                    <span>
                        Please make sure that your computer has a public IP or forwarded ports 40102, 40103, 3282.
                        Otherwise you may not be able to run Golem node properly.
                        <br/>
                        <br/>
                        If you don't know how to do it please follow this <a href="">instructions</a>.
                    </span>
                </div>
            </div>
        )
    }
}
