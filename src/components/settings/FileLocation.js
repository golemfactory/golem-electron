import React from 'react';

export default class FileLocation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content__file-location">
            	<div>
            		<span>Output Folder</span>
            		<input type="text" disabled placeholder="..Docs/Golem/Output"/>
            		<button className="btn--outline">Change</button>
            	</div>
            	<div>
            		<span className="tips__file-location">Output folder is where the returned results of your tasks will go. </span>
            	</div>
            </div>
        );
    }
}
