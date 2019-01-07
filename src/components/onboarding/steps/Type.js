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
                    <h1>There is no password recovery</h1>
                    <span>
                        We do not keep a copy of your password. After 
                        password creation remember to write it down or print
                        it, as there is no password recovery option
                        <br/>
                        <a href="https://golem.network/documentation/02-risks/">Learn more</a>
                    </span>
                </div>  
            </div>
        );
    }
}
