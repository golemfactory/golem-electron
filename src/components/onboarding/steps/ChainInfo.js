import React from 'react';

import mainNetIcon from './../../../assets/img/main-net-icon.svg'
import testNetIcon from './../../../assets/img/main-net-icon.svg'

export default class ChainInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="chain-image" src={mainNetIcon}/>
                </div>
                <div className="desc__onboarding">
                    <span>You are going to run
                    <br/>
                    <strong>Golem on main net.</strong>
                    <br/><br/><br/>
                        <mark className="mark--chain">
                        Make sure that you know all the risks and take responsible actions.
                        <br/>
                        If you want to learn more just talk with us on <a href="https://chat.golem.network">our chat.</a>
                        </mark>
                    </span>
                </div>  
            </div>
        );
    }
}
