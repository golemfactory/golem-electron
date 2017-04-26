import React from 'react';

import networkPreview from './../../../assets/img/network-preview.png'

export default class Step3 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
            	<div className="section-image__onboarding">
            		<img src={networkPreview}/>
            	</div>
            	<div className="desc__onboarding">
            		<span>The Network tab is where you can run Golem,  set your power allocation and view your  earnings balance.</span>
            	</div>
            </div>
        )
    }
}
