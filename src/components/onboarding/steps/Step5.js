import React from 'react';

import docPreview from './../../../assets/img/doc-preview.png'

export default class Step5 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
            	<div className="section-image__onboarding">
            		<img className="doc-image" src={docPreview}/>
            	</div>
            	<div className="desc__onboarding">
            		<span>If you need help at any time,  the Docs button on the toolbar should answer  most of your questions. You’re also welcome  to join our public Slack.</span>
            	</div>
            </div>
        );
    }
}
