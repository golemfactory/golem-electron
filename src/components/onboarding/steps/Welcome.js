import React from 'react';

import welcomeBeta from './../../../assets/img/welcome-beta.svg'

export default class Welcome extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={welcomeBeta}/>
                </div>
                <div className="desc__onboarding">
                    <span>Thanks for installing Brass Golem.
                    <br/>
                    Let’s set up a few things 
                    <br/>
                    for you before we start.</span>
                    <br/>
                    <span className="desc__port"><mark><strong>Attention:</strong> Please make sure that your computer has a public IP
                    <br/>or forwarded ports <strong>40102, 40103, 3282</strong>. Otherwise
                    <br/>you may not be able to run Golem properly! <a href="https://golem.network/documentation/09-common-issues-troubleshooting/port-forwarding-connection-errors/#getting-started">Learn more</a>
                    <br/>
                    <br/><b>Virtualization VT-X/AMD-v needs to be enabled</b> in BIOS
                    <br/>as it is mandatory for Golem. <a href="">Learn more</a>
                    </mark>
                    </span>
                </div>
            </div>
        );
    }
}