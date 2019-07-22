import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@tippy.js/react';

import * as Actions from './../../../actions';

const mapStateToProps = state => ({
    isEngineOn: state.info.isEngineOn,
    stats: state.stats.stats,
    unsupported_stats: state.stats.unsupported_stats
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const UNSUPPORTED_LABELS = {
    environment_missing: {title: "Env. is missing", description: "Golem could not find required environment for the task on your computer. Currently the only support environment for GPU is Nvidia graphic card on Linux."},
    environment_unsupported: {title: "Env. is not supported", description: "Golem found required environment on your machine but is not able to connect to it."},
    environment_not_accepting_tasks: {title: "Env. is not accepting tasks", description: "Check if in \"Network Trust\" in Settings Tab the switch enabling you to act only as a requestor is turned off. You may also need to open terminal and type in CLI 'golemcli envs enable BLENDER' and you will be able to take on the tasks."},
    environment_not_secure: {title: "Env. is not secure", description: "-"},
    environment_misconfigured: {title: "Env is misconfigured", description: "-"},
    max_price: {title: "Price settings", description: "Your price settingns are set up to high with tasks currently being in the network. Adjust them if you want to take on the tasks."},
    app_version: {title: "App version", description: "Your Golem version is not up to date. Please update it to the most current one to take on the tasks."},
    deny_list: {title: "Deny list", description: "It looks that some node(s) included you in their blacklist."},
    requesting_trust: {title: "Trust settings", description: "Your current trust settings are set to restrict for this particular tasks. Adjust them properly to take on the tasks."},
    cannot_perform_network_request: {title: "Cannot perform network request", description: "-"},
    mask_mismatch: {title: "Mask Mismatch", description: "Network masking was created in order, not to overload requestors computers with too many inquiries from providers. All providers are randomly selected by requestors. So if you see 'mask_mismatch' it only means that your nodes were not selected for those particular tasks."},
    concent_required: {title: "Concent is required", description: "Amount of tasks in network that require Concent Service. Turn Concent Service on."}
}

export class ProviderStats extends React.PureComponent {
    _loadReasons = data =>
        data.map((item, index) => (
            <div key={index.toString()}>
                <Tooltip
                        content={<p>{UNSUPPORTED_LABELS[item.reason].description}</p>}
                        placement="bottom"
                        maxWidth="200"
                        size="small"
                        trigger="mouseenter">
                    <span>{UNSUPPORTED_LABELS[item.reason].title}:</span>
                </Tooltip>
                <span>{item.ntasks}</span>
            </div>
        ));

    render() {
        const { isEngineOn, stats, unsupported_stats } = this.props;
        return (
            <div>
                <div>
                    <h4>Task Statistics</h4>
                    {stats && Number.isInteger(stats.in_network) ? (
                        <div className="statistics__task">
                            <div>
                                <span className="icon-tasks-all" />
                                <span>
                                    Tasks on network: {stats.in_network}
                                </span>
                            </div>
                            <div>
                                <span className="icon-tasks-supported" />
                                <span>Supported tasks: {stats.supported}</span>
                            </div>
                            <div>
                                <span className="icon-finished" />
                                <span>
                                    Computed subtasks:{' '}
                                    {stats.subtasks_computed[1]}
                                </span>
                            </div>
                            <div>
                                <span className="icon-subtask-verifying" />
                                <span>
                                    Accepted subtasks:{' '}
                                    {stats.subtasks_accepted[1]}
                                </span>
                            </div>
                            <div>
                                <span className="icon-failure" />
                                <span>
                                    Subtasks with errors:{' '}
                                    {stats.subtasks_with_errors[1]}
                                </span>
                            </div>
                            <div>
                                <span className="icon-timeout" />
                                <span>
                                    Subtasks with timeouts:{' '}
                                    {stats.subtasks_with_timeout[1]}
                                </span>
                            </div>
                            <div>
                                <span className="icon-subtask-verifying" />
                                <span>
                                    Rejected subtasks:{' '}
                                    {stats.subtasks_rejected[1]}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="no-stats">No available data.</div>
                    )}
                </div>
                <div>
                    <h4>Reasons for not supporting tasks</h4>
                    <div className="statistics__unsupported-task">
                        {Array.isArray(unsupported_stats) &&
                            this._loadReasons(unsupported_stats)}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProviderStats);
