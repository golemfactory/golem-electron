import React from 'react';

export default class Step5 extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-step__onboarding">
                <div className="section-image__onboarding">
                    <div className="container-checkbox__onboarding">
                        <div className="checkbox-item">
                            <span className="icon-blender">
                                <span className="path1"/>
                                <span className="path2"/>
                                <span className="path3"/>
                            </span>
                            <input id="taskTypeRadio1" type="checkbox" name="taskType"/>
                            <label htmlFor="taskTypeRadio1" className="radio-label">Blender</label>
                        </div>
                        <div className="checkbox-item">
                            <span className="icon-luxrenderer"/>
                            <input id="taskTypeRadio2" type="checkbox" name="taskType"/>
                            <label htmlFor="taskTypeRadio2" className="radio-label">LuxRender</label>
                        </div>
                        <div className="checkbox-item">
                            <span className="icon-luxrenderer"/>
                            <input id="taskTypeRadio3" type="checkbox" name="taskType"/>
                            <label htmlFor="taskTypeRadio3" className="radio-label">LuxRender</label>
                        </div>
                        <div className="checkbox-item">
                            <span className="icon-luxrenderer"/>
                            <input id="taskTypeRadio4" type="checkbox" name="taskType"/>
                            <label htmlFor="taskTypeRadio4" className="radio-label">LuxRender</label>
                        </div>
                    </div>
                </div>
                <div className="desc__onboarding">
                    <span>Please select your default task type.  You can change this later when you add tasks. If you do not plan to use tasks, just skip this.</span>
                </div>
            </div>
        )
    }
}
