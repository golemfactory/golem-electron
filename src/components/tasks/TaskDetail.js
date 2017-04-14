import React from 'react';
import { Link } from 'react-router';

export default class TaskDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content__task-detail">
                <section className="section-preview__task-detail">
                    <div className="panel-preview__task-detail">
                        <Link to="/tasks">
                            <div>
                                <span className="icon-arrow-left-white"/>
                                <span>Back</span>
                            </div>
                        </Link>
                    </div>
                    <button className="btn--outline">Render Local Test</button>
                </section>
                    <div className="container__task-detail">
                        <section className="section-settings__task-detail">
                            <h4>Settings</h4>
                            <div className="item-settings">
                                <span className="title">Preset</span>
                                <div className="select">
                                    <select >
                                        <option>4K Best Quality</option>
                                    </select>
                                </div> 
                            </div>
                            <div className="item-settings">
                                <span className="title">Dimensions</span>
                                <input type="number"/>
                                <span className="icon-cross"/>
                                <input type="number"/>
                            </div>
                            <div className="item-settings">
                                <span className="title">Frame Range</span>
                                <input type="text"/>
                            </div>
                            <div className="item-settings">
                                <span className="title">Format</span>
                                <div className="select">
                                    <select >
                                        <option>PNG</option>
                                    </select>
                                </div>
                            </div>
                            <div className="item-settings">
                                <span className="title">Output to</span>
                                <input type="text" placeholder="…Docs/Golem/Output"/>
                                <button className="btn--outline">Change</button>
                            </div>
                            <div className="item-settings">
                                <span className="title">Blender Compositing</span>
                                <div className="switch-box switch-box--green">
                                <span>Off</span>
                                <label className="switch">
                                    <input type="checkbox"/>
                                    <div className="switch-slider round"></div>
                                </label>
                            </div>
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
                                <input type="number"/>
                                <span>GNT</span>
                            </div>
                            <span className="item-price tips__price">
                                You can accept the estimated price or you can bid higher if you would like to increase your chances of quicker processing.
                            </span>
                        </section>
                    </div>

                        <section className="section-action__task-detail">
                            <span>Cancel</span>
                            <button className="btn--primary">Start Task</button>
                        </section>
            </div>
        );
    }
}
