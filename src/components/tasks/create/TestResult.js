import React, { Component } from "react";
import { Link } from "react-router-dom";
import isEqual from "lodash/isEqual";

import checkNested from "../../../utils/checkNested";
import isObjectEmpty from "../../../utils/isObjectEmpty";
import { testStatusDict } from "../../../constants/statusDicts";
import DotAnim from "./../../DotAnim";

const { remote } = window.electron;
const mainProcess = remote.require("./index");
const { dialog } = remote;

class TestResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ignoreTestWarning: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.testStatus, this.props.testStatus)) {
            const { locked } = this._handleTestStatus(nextProps.testStatus);
            this.props.toggleTestLock(locked);
        }
    }

    _handleTestStatus({ status, error, more }) {
        switch (status) {
            case testStatusDict.STARTED:
                return {
                    class: "btn--loading",
                    text: "Checking",
                    locked: true
                };

            case testStatusDict.SUCCESS:
                return {
                    class: "btn--success",
                    text: "Test passed!",
                    locked: false
                };

            case testStatusDict.ERROR:
                return {
                    class: "btn--error",
                    text: "Error",
                    locked: true
                };

            default:
                return {
                    class: "",
                    text: "Render Local Test",
                    locked: true
                };
        }
    }

    _getPanelClass(testStatus) {
        return this._checkTestStatus(testStatus);
    }

    _checkTestStatus(_testStatus) {
        const { more, error } = _testStatus;
        let status;
        if (!isObjectEmpty(more)) {
            if (more.after_test_data.hasOwnProperty("warnings")) {
                status = "warning";
            } else {
                status = "success";
            }
        }

        if (!isObjectEmpty(error)) {
            if (error.length > 0 && typeof error[0] === "string") {
                status = "error";
            }
        }

        return status;
    }

    _getPanelInfo(testStatus) {
        const { more, error } = testStatus;
        const status = this._checkTestStatus(testStatus);
        let warningInfo;

        switch (status) {
            case "warning":
                if (
                    checkNested(
                        more,
                        "after_test_data",
                        "warnings",
                        "missing_files"
                    )
                ) {
                    function fillFiles(files) {
                        return files.map((file, index) => (
                            <li key={index.toString()}>{`${
                                file.baseName
                            } should be in ${file.dirName.replace(
                                "/golem/resources",
                                "{project_folder}"
                            )}/`}</li>
                        ));
                    }

                    return (
                        <div className={`local-render__info info-${status}`}>
                            <h4>Test passed, but...</h4>
                            <span>It looks like some data is missing;</span>
                            <div className="missing-file-list">
                                <ul>
                                    {fillFiles(
                                        more.after_test_data.warnings
                                            .missing_files
                                    )}
                                </ul>
                            </div>
                            <span>
                                You can try to add missing files, like textures
                                with the button below. You can also try to add
                                missing scripts to your .blend file and resubmit
                                the task. Or you can simply ignore this warning
                                if the scripts or textures are not needed.
                            </span>
                            <div className="local-render__action">
                                <span onClick={this._ignoreTestWarning}>
                                    Ignore
                                </span>
                                <button
                                    className="btn--primary"
                                    onClick={this._onFileDialog.bind(
                                        this,
                                        more.after_test_data.warnings
                                            .missing_files
                                    )}
                                >
                                    Add files
                                </button>
                            </div>
                        </div>
                    );
                } else
                    return (
                        <div className={`local-render__info info-${status}`}>
                            Test passed! You are good to go.
                        </div>
                    );
            case "error":
                function fillError(errors) {
                    return errors.map((error, index) => (
                        <li key={index.toString()}>{error}</li>
                    ));
                }

                return (
                    <div className={`local-render__info info-${status}`}>
                        <h4>Whoops!</h4>
                        <ul>{fillError(testStatus.error)}</ul>
                        <span className="error__hint">
                            You can try to find solution for this error in{" "}
                            <a href="https://golem.network/documentation/06-preparing-your-blend-file/">
                                here
                            </a>
                            , or talk with our tech support on{" "}
                            <a href="https://chat.golem.network">Rocket Chat</a>
                            .
                        </span>
                    </div>
                );
            case "success":
                return (
                    <span className={`local-render__info info-${status}`}>
                        Test passed! You are good to go.
                    </span>
                );
            default:
                return (
                    <span className="local-render__info">
                        <DotAnim>
                            checking
                        </DotAnim>
                    </span>
                );
        }
    }

    _ignoreTestWarning = () => this.setState({ ignoreTestWarning: true });

    /**
     * [_onFileDialog func. opens file chooser dialog then checks if files has safe extensions after all triggers test again]
     */
    _onFileDialog(_missingFiles) {
        const onFileHandler = data => {
            //console.log(data)
            if (data) {
                mainProcess
                    .selectDirectory(data, this.props.isMainNet)
                    .then(item => {
                        let mergedList = [].concat.apply([], item);
                        let unknownFiles = mergedList.filter(
                            ({ malicious }) => malicious
                        );

                        if (unknownFiles.length > 0) {
                            this.props.actions.setFileCheck({
                                status: true,
                                files: unknownFiles
                            });
                        } else {
                            mainProcess
                                .copyFiles(
                                    mergedList,
                                    _missingFiles,
                                    this.props.task.relativePath
                                )
                                .then(result => {
                                    this.props.actions.addMissingFiles(result);
                                })
                                .catch(error => console.error);
                        }
                    });
            }
        };
        /**
         * We're not able to let people to choose directory and file at the same time.
         * @see https://electron.atom.io/docs/api/dialog/#dialogshowopendialogbrowserwindow-options-callback
         */
        dialog.showOpenDialog(
            {
                properties: ["openFile", "multiSelections"]
            },
            onFileHandler
        );
    }

    render() {
        const { ignoreTestWarning } = this.state;
        const { testStatus, isDetailPage } = this.props;

        return !ignoreTestWarning ? (
            <section
                className={`section-preview__task-detail ${this._getPanelClass(
                    testStatus
                )}`}
            >
                {isDetailPage && (
                    <div className="panel-preview__task-detail">
                        <Link to="/tasks" aria-label="Back button to task list">
                            <span className="icon-back" />
                            <span>Back</span>
                        </Link>
                    </div>
                )}
                {!isDetailPage && testStatus.status !== null ? (
                    this._getPanelInfo(testStatus)
                ) : !isDetailPage ? (
                    <span className="local-render__info">
                        testing local render...
                    </span>
                ) : (
                    <span className="local-render__info" />
                )}
            </section>
        ) : (
            <div />
        );
    }
}

export default TestResult;
