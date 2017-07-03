import React from 'react';

import welcomeBeta from './../../../assets/img/welcome-beta.svg'

export default class Step1 extends React.Component {

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
                    <span>Thanks for installing Brass Golem, 
                    the worldwide supercomputer.
                    Let’s set up a few things for you before we start.</span>
                    <span className="desc__port"><mark><strong>Attention:</strong> Please make sure that your computer has public IP or forwarded ports 40102, 40104, 3828.
                    Get more info <a href="https://github.com/golemfactory/golem/wiki/Testing#how-to-start-testing">here.</a>
                    </mark></span>
                </div>
            </div>
        );
    }
}
