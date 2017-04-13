import React from 'react';

export default class RadialProgress extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="radial-progress-bar" data-pct="16">
                <svg id="radialSvg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" preserveAspectRatio="xMinYMin meet">
                    <circle r="47.25" cx="52.5" cy="52.5" fill="transparent" strokeDasharray="565.48" strokeDashoffset="0"></circle>
                    <circle id="bar" r="47.25" cx="52.5" cy="52.5" fill="transparent" strokeDasharray="565.48" strokeDashoffset="0"></circle>
                </svg>
            </div>
        );
    }
}
