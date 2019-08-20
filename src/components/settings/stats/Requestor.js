import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@tippy.js/react';

import * as Actions from './../../../actions';

const mapStateToProps = state => ({
    stats: state.stats.stats.requestor
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

export class RequestorStats extends React.PureComponent {
    render() {
        const { stats } = this.props;
        return (
            <div>
                {stats && Number.isInteger(stats.tasks_in_network_cnt) ? (
                    <div className="statistics__requestor">
                        <div className="stats-item stats-item-bold">
                            <span className="icon-tasks-all" />
                            <span>
                                <Tooltip
                                    content={
                                        <p>
                                            Amount of all your tasks that
                                            currently are in the network.
                                        </p>
                                    }
                                    placement="bottom"
                                    maxWidth="200"
                                    size="small"
                                    maxWidth="90%"
                                    trigger="mouseenter">
                                    <span>Tasks on network: </span>
                                </Tooltip>
                                {stats.tasks_in_network_cnt}
                            </span>
                        </div>
                        <div className="stats-item stats-item-bold">
                            <span className="icon-finished icon--color-green" />
                            <span>
                                <Tooltip
                                    content={
                                        <p>
                                            Amount of all your tasks that were
                                            successfully computed by providers.
                                        </p>
                                    }
                                    placement="bottom"
                                    maxWidth="200"
                                    size="small"
                                    maxWidth="90%"
                                    trigger="mouseenter">
                                    <span>Tasks computed with success: </span>
                                </Tooltip>
                                {stats.current_tasks_stats.finished_task_cnt}
                            </span>
                        </div>
                        <div className="stats-item stats-item-bold">
                            <span className="icon-failure icon--color-red" />
                            <span>
                                <Tooltip
                                    content={
                                        <p>
                                            Amount of all your tasks that were
                                            computed by providers and ended with
                                            error. You can find reasons for
                                            failures in a list below.
                                        </p>
                                    }
                                    placement="bottom"
                                    maxWidth="200"
                                    size="small"
                                    maxWidth="90%"
                                    trigger="mouseenter">
                                    <span>Tasks with errors: </span>
                                </Tooltip>
                                {stats.current_tasks_stats.failed_subtasks_cnt}
                            </span>
                        </div>
                        <hr />
                        <div className="stats-item">
                            <span className="icon-timeout icon--color-red" />
                            <span>
                                <Tooltip
                                    content={
                                        <p>
                                            Timeouts can happen if you set 'Task
                                            timeout' at to low value. Please
                                            check how adjust timeouts over{' '}
                                            <a href="">here.</a>
                                        </p>
                                    }
                                    placement="bottom"
                                    maxWidth="200"
                                    size="small"
                                    maxWidth="90%"
                                    trigger="mouseenter">
                                    <span>Timeout: </span>
                                </Tooltip>
                                {
                                    stats.current_tasks_stats
                                        .timed_out_subtasks_cnt
                                }
                            </span>
                        </div>
                        <div className="stats-item">
                            <span className="icon-verifying-error">
                                <span className="path1" />
                                <span className="path2" />
                                <span className="path3" />
                                <span className="path4" />
                                <span className="path5" />
                            </span>
                            <span>
                                <Tooltip
                                    content={
                                        <p>
                                            You can reduce the amount of
                                            verification failures by setting the
                                            power of nodes you are connecting
                                            with in Benchmark tab.
                                        </p>
                                    }
                                    placement="bottom"
                                    maxWidth="200"
                                    size="small"
                                    trigger="mouseenter">
                                    <span>Verification failure: </span>
                                </Tooltip>
                                {stats.current_tasks_stats
                                    .collected_results_cnt -
                                    stats.current_tasks_stats
                                        .verified_results_cnt}
                            </span>
                        </div>
                        <div className="stats-item">
                            <span className="icon-failure icon--color-red" />
                            <span>
                                <Tooltip
                                    content={
                                        <p>
                                            You can check particular subtask
                                            logs in the detailed task preview
                                            that you can access from the task
                                            list with the{' '}
                                            <span className="icon-eye" />. Make
                                            sure that you are in 'dev mode' that
                                            you can turn on with ctrl/cmd + D
                                            shortcut.
                                        </p>
                                    }
                                    placement="bottom"
                                    maxWidth="200"
                                    size="small"
                                    maxWidth="90%"
                                    trigger="mouseenter">
                                    <span>Error: </span>
                                </Tooltip>
                                {stats.finished_tasks_stats.failed.tasks_cnt}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="no-stats">No available data.</div>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestorStats);
