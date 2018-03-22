import React from 'react';

import ohReally from './../../../assets/img/oh-really.svg'

export default class Decline extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding welcome-beta">
                   <img className="welcome-image" src={ohReally}/>
                </div>
                <div className="desc__onboarding">
                    <span>Are you sure you want to leave 
                    <br/>
                    Golem without trying?
                    <br/>
                    We hope you consider your decision,
                    <br/>
                    if not, come back soon.
                    </span>
                </div>  
            </div>
        );
    }
}
