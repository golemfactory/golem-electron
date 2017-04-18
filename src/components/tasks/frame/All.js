import React from 'react';
const data = [
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 2,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 2,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 1,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    },
    {
        status: 2,
        duration: 1206
    },
    {
        status: 0,
        duration: 1206
    }
]

let status = [
    'frame--undone',
    'frame--progress',
    'frame--done'
]

Object.freeze(status)

export default class All extends React.Component {

    constructor(props) {
        super(props);
    }

    loadAllFrames() {
        return data.map((item, index) => <div className="item__all-frame" key={index}>
        	<div className={`${status[item.status]}`}></div>
        	</div>)
    }

    render() {
        return (
            <div className="container__all-frame">
            	{ this.loadAllFrames()}
            </div>
        );
    }
}
