import React from 'react';

import mainNetIcon from './../../../assets/img/main-net-icon.svg'
import testNetIcon from './../../../assets/img/test-net-icon.svg'

export default class VirtualisationInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {isMainNet} = this.props
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="chain-image" src={isMainNet ? mainNetIcon : testNetIcon}/>
                </div>
                <div className="desc__onboarding">
                    <h1>Virtualisation is required</h1>
                    <span>
                    We have detected that Virtualisation on your machine <br/>
                    is disabled. Vt-X/AMD-v needs to be ennabled in BIOS <br/>
                    as it is mandatory to run Golem. If you want to know <br/>
                    how to enable it, please follow this <a href="">instructions</a>
                    </span>
                </div>  
            </div>
        );
    }
}
