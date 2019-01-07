import React from 'react';

import docPreview from './../../../assets/img/doc-preview.png'
import SpotLight from '../../SpotLight'

export default class Step4 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding section__fixed">
                    <img className="doc-image" src={docPreview}/>
                    <SpotLight posX={[37, 51]} posY={[18, 26]} r={[10, 10]}/>
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
