import React from 'react';
import Slider from './../../Slider.js'


export default class Resources extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="content__resources">
                <Slider value="25" iconLeft="icon-single-server" iconRight="icon-multi-server"/>
                <div className="slider__tips">
                        Use the slider to choose how much of your machine’s resources 
                    (CPU, RAM and disk space) Golem can use. More power means 
                    more potential income.
                </div>
            </div>
        );
    }
}
