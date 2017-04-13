import React from 'react';

export default class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content__task-detail">
                Task {this.props.params.id} Detail Page
            </div>
        );
    }
}
