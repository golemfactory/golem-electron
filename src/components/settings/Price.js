import React from 'react';

export default class Price extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content__price">
            	<div className="section__price">
            		<span>Provider Minimum</span>
            		<input type="number" disabled value="0.00"/>
            		<span>USD per hour</span>
            	</div>
            	<div className="section__price">
            		<span>Requestor Maximum</span>
            		<input type="number" disabled value="0.00"/>
            		<span>USD per hour</span>
            	</div>
            </div>
        );
    }
}
