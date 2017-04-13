import React from 'react';
import RadialProgress from './../RadialProgress'
import Avatar from './../../assets/img/Avatar.svg'

export default class Personal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="section__personal">
                <div className="indicator-panel__personal">
                    <div className="indicator__personal">
                        <RadialProgress/>
                        <span>Requestor</span>
                        <p/><span className="icon-question-mark"/>
                    </div>
                    <div>
                        <img className="image__personal" src={Avatar}/>
                    </div>
                    <div className="indicator__personal">
                        <RadialProgress/>
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
