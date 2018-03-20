import React from 'react';

const taskType = Object.freeze({
    BLENDER: 'Blender',
    LUXRENDER: 'LuxRender'
})

export default class PresetModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            name: null
        }
    }

    /**
     * [_handleNameInput func. updates task preset name to be created]
     * @param  {Event}      e
     */
    _handleNameInput(e) {
        this.setState({
            name: e.target.value
        })
    }

    /**
     * [_handleCancel func. closes modal]
     */
    _handleCancel() {
        this.props.closeModal('presetModal')
    }

    /**
     * [_handleSave func. sends custom task presets object as callback to be created and closes modal]
     * @return {[type]} [description]
     */
    _handleSave() {
        const {saveCallback, resolution, frames, format, output_path, compositing, sample_per_pixel, task_type} = this.props
        const {name} = this.state

        function getPresentObject(type) {
            switch (type) {
            case taskType.BLENDER:
                return {
                    resolution,
                    frames,
                    format,
                    output_path,
                    compositing
                }
            case taskType.LUXRENDER:
                return {
                    resolution,
                    format,
                    output_path,
                    compositing,
                    sample_per_pixel
                }
            }
        }

        saveCallback(name, getPresentObject(task_type))
        this.props.closeModal('presetModal')

    }

    render() {
        const {resolution, frames, format, output_path, compositing, sample_per_pixel, task_type} = this.props
        return (
            <div className="container__modal task-preset-modal ">
                <div className="content__modal">
                    <section className="section__naming">
                        <h4>Name your Preset</h4>
                        <input type="text" onChange={::this._handleNameInput} autoFocus required />
                    </section>
                    <section className="section__info">
                        <h5>Dimensions</h5>
                        <span>{resolution && resolution[0]} x {resolution && resolution[1]}</span>
                        {taskType.BLENDER == task_type && <h5>Frame Range</h5>}
                        {taskType.BLENDER == task_type && <span>{frames}</span>}
                        <h5>Format</h5>
                        <span>{format} File</span>
                        <h5>Output to</h5>
                        <span>{output_path}</span>
                        {taskType.BLENDER == task_type && <h5>Blender Compositing</h5>}
                        {taskType.BLENDER == task_type && <span>{compositing ? 'On' : 'Off'}</span>}
                        {taskType.LUXRENDER == task_type && <h5>Sample per pixel</h5>}
                        {taskType.LUXRENDER == task_type && <span>{sample_per_pixel}</span>}
                    </section>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="button" className="btn--primary" onClick={::this._handleSave} autoFocus>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
