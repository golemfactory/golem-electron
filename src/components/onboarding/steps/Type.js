import React from 'react';

import penIcon from './../../../assets/img/pen.svg'

export default class Type extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={penIcon}/>
                </div>
                <div className="desc__onboarding">
                    <span>We do not keep a copy of your
                    <br/>
                    password. Remember to write it down,
                    <br/>
                    otherwise there will be <strong>no option</strong>
                    <br/>
                    to recover it. <a href="https://golem.network/documentation/02-risks/">Learn more</a></span>
                    
                    <span className="info__print">After creating your password you will
                    <br/>
                    have an option to print it out. But as it is not
                    <br/>
                    fully secure, we advise you write it down in a safe place.
                    </span>
                </div>  
            </div>
        );
    }
}
