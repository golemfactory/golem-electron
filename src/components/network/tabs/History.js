import React from 'react';

const mockHistory = [
    {
        title: 'Processed Task',
        time: '1:15',
        status: 'Pending',
        amount: '+0.014 GNT'
    },
    {
        title: 'HMD Model Bake 3.5',
        time: '1:03',
        status: '3:01AM 28 Feb',
        amount: '-0.017 GNT'
    },
    {
        title: 'Processed Task',
        time: '2:15',
        status: '8:01AM 28 Feb',
        amount: '+0.015 GNT'
    },
    {
        title: 'Processed Task',
        time: '2:15',
        status: '8:01AM 28 Feb',
        amount: '+0.013 GNT'
    }
]

export default class History extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * [loadHistory loading payment history as DOM]
     */
    loadHistory() {
        return (mockHistory.map(({title, time, status, amount}, index) => <div key={index} className="item__history">
            <div className="info__history">
                <h5>{title}</h5>
                <span>{time}</span>
                <span>{status}</span>
            </div>
            <div className="action__history">
                <span className="amount__history">{amount}</span>
                <span className="icon-new-window"/>
            </div>
        </div>))
    }

    render() {
        return (
            <div className="content__history">
                {this.loadHistory()}
            </div>
        );
    }
}
