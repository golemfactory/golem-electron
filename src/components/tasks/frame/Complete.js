import React from 'react';

const data = [
    {
        status: 1,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    }
]

let status = [
    'frame--undone',
    'frame--done'
]

Object.freeze(status)

export default class Complete extends React.Component {

    constructor(props) {
        super(props);
    }

    loadAllFrames() {
        return data.map((item, index) => <div className="item__completed-frame" key={index}>
        	<div className={`${status[item.status]}`}></div>
        	</div>)
    }

    render() {
        return (
            <div className="container__completed-frame">
            	{ this.loadAllFrames()}
            </div>
        );
    }
}