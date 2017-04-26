import React from 'react';
import RadialProgress from './../RadialProgress'
import Avatar from './../../assets/img/avatar.svg'

export default class Personal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="section__personal">
                <div className="indicator-panel__personal">
                    <div className="indicator__personal">
                        <RadialProgress pct={16}/>
                        <span>Requestor</span>
                        <p/><span className="icon-question-mark"/>
                    </div>
                    <div>
                        <img className="image__personal" src={Avatar} alt="avatar"/>
                    </div>
                    <div className="indicator__personal">
                        <RadialProgress pct={30}/>
                        <span>Provider</span>
                    </div>
                </div>
                <div>
                    <span className="user-name__personal">Muhammed Tanrıkulu</span>
                    <p/><span className="user-id__personal"> a34a…3bb2</span>
                    <p/><a>Edit Profile</a>
                </div>
            </div>
        );
    }
}
