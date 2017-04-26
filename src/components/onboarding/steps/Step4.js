import React from 'react';

import tasksPreview from './../../../assets/img/tasks-preview.png'

export default class Step4 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding">
                    <img src={tasksPreview}/>
                </div>
                <div className="desc__onboarding">
                    <span>The Tasks tab is where you can request computing power from the Golem Network, edit task settings and monitor progress.</span>
                </div>
            </div>
        )
    }
}
