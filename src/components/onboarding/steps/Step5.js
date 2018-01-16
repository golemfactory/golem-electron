import React from 'react';

import docPreview from './../../../assets/img/doc-preview.png'
import SpotLight from '../../SpotLight'

export default class Step6 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding">
                    <img className="doc-image" src={docPreview}/>
                    <SpotLight posX={[37, 51]} posY={[18, 26]} r={[10, 10]}/>
                </div>
                <div className="desc__onboarding">
                    <span>If you need help at any time, the Docs button on the toolbar should answer most of your questions. You’re also welcome to join our public chat.</span>
                </div>
            </div>
        );
    }
}
