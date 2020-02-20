import React from 'react';

export default class Welcome extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="concent-onboarding__step">
                <div className="concent-onboarding__desc">
                    <div>
                        <h3>Finally it's here!</h3>
                        <h2>Concent Service protection</h2>
                    </div>
                    <div className="whats-new__list">
                        <h4>Benefit of using Concent:</h4>
                        <div>
                             <div className="whats-new__item">
                                <span className="icon-ok-hand"></span>
                                <div>
                                    <h4>Fair transactions</h4>
                                    <span>Concent Service will make sure that you are paid for the computational power you have used to perform assigned computations.</span>
                                </div>
                            </div>
                            <div className="whats-new__item">
                                <span className="icon-high-five"></span>
                                <div>
                                    <h4>Better network trust</h4>
                                    <span>Both providers and requrestors will have economic incentive not to cheat in the network. This should increase the general trust between the actors.</span>
                                </div>
                            </div>
                            <div className="whats-new__item">
                                <span className="icon-shield"></span>
                                <div>
                                    <h4>Abuse protection for Providers and Requestors</h4>
                                    <span>If you act as a requestor, Concent Service will ensure that payments are enforced only for correct results.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        );
    }
}
