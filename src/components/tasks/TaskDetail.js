import React from 'react';
import { Link } from 'react-router';

export default class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
        function IsNumeric(input) {
            return (input - 0) == input && ('' + input).trim().length > 0;
        }
        this.state = {
            showBackOption: IsNumeric(props.params.id)
        }
    }

    render() {
        const {showBackOption} = this.state
        return (
            <div className="content__task-detail">
                <section className="section-preview__task-detail">
                    { showBackOption && <div className="panel-preview__task-detail">
                        <Link to="/tasks" aria-label="Back button to task list">
                            <div>
                                <span className="icon-arrow-left-white"/>
                                <span>Back</span>
                            </div>
                        </Link>
                    </div>}
                    {!showBackOption && <button className="btn--outline">Render Local Test</button>}
                </section>
                    <div className="container__task-detail">
                        <section className="section-settings__task-detail">
                            <h4>Settings</h4>
                            <div className="item-settings">
                                <span className="title">Preset</span>
                                <div className="select">
                                    <select role="combobox" aria-label="Quality">
                                        <option role="option">4K Best Quality</option>
                                    </select>
                                </div> 
                            </div>
                            <div className="item-settings">
                                <span className="title">Dimensions</span>
                                <input type="number" aria-label="Dimensions (width)"/>
                                <span className="icon-cross"/>
                                <input type="number" aria-label="Dimensions (height)"/>
                            </div>
                            <div className="item-settings">
                                <span className="title">Frame Range</span>
                                <input type="text" aria-label="Frame Range"/>
                            </div>
                            <div className="item-settings">
                                <span className="title">Format</span>
                                <div className="select">
                                    <select role="combobox" aria-label="File Format">
                                        <option role="option">PNG</option>
                                    </select>
                                </div>
                            </div>
                            <div className="item-settings">
                                <span className="title">Output to</span>
                                <input type="text" placeholder="…Docs/Golem/Output" aria-label="Output path"/>
                                <button className="btn--outline">Change</button>
                            </div>
                            <div className="item-settings">
                                <span className="title">Blender Compositing</span>
                                <div className="switch-box switch-box--green">
                                    <span>Off</span>
                                    <label className="switch">
                                        <input type="checkbox" aria-label="Blender Compositing Checkbox" tabIndex="0"/>
                                        <div className="switch-slider round"></div>
                                    </label>
                                </div>
                            </div>
                             <div className="item-settings">
                                <span className="title">Deadline</span>
                                <input type="text" placeholder="16:20:00" aria-label="Deadline"/>
                            </div>
                            <div className="item-settings">
                                <span className="title">Subtask Amount</span>
                                <input type="text" placeholder="8" aria-label="Subtask amount"/>
                            </div>
                            <div className="item-settings">
                                <span className="title">Subtask Timeout</span>
                                <input type="text" placeholder="4:10:00" aria-label="Deadline"/>
                            </div>
                        </section>
                        <section className="section-price__task-detail">
                            <h4 className="title-price__task-detail">Price</h4>
                            <div className="item-price estimated-price__panel">
                                <span className="title">Estimated</span>
                                <span className="estimated-price">0.2</span>
                                <span>GNT</span>
                            </div>
                            <div className="item-price">
                                <span className="title">Your bid</span>
                                <input type="number"aria-label="Your bid"/>
                                <span>GNT</span>
                            </div>
                            <span className="item-price tips__price">
                                You can accept the estimated price or you can bid higher if you would like to increase your chances of quicker processing.
                            </span>
                        </section>
                    </div>

                        {!showBackOption && <section className="section-action__task-detail">
                            <Link to="/tasks" aria-label="Cancel" tabIndex="0">
                                <span >Cancel</span>
                            </Link>
                            <button className="btn--primary">Start Task</button>
                        </section>}
            </div>
        );
    }
}
