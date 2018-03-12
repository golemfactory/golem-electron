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
                    <span>We do not keep the copy of your
                    <br/>
                    password. Remember to write it down,
                    <br/>
                    otherwise there will be <strong>no option</strong>
                    <br/>
                    to recover it. <a href="">Learn more</a></span>
                </div>
            </div>
        );
    }
}
