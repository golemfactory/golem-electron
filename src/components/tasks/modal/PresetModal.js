import React from "react";
import ConditionalRender from '../../hoc/ConditionalRender';

const taskType = Object.freeze({
    BLENDER: "Blender",
    BLENDER_NVGPU: 'Blender_NVGPU'
});

export default class PresetModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null
        };
    }

    componentDidMount() {
        const presetNameInput = document.getElementById('nameInput');
        if (presetNameInput) {
            this.focusTimeout = setTimeout(() => presetNameInput.focus(), 600); //CSSTransition issue related
        }
    }

    componentWillUnmount() {
        this.focusTimeout && clearTimeout(this.focusTimeout)
    }

    /**
     * [_handleNameInput func. updates task preset name to be created]
     * @param  {Event}      e
     */
    _handleNameInput = e => this.setState({ name: e.target.value });

    /**
     * [_handleCancel func. closes modal]
     */
    _handleCancel = () => this.props.closeModal("presetModal");

    /**
     * [_handleSave func. sends custom task presets object as callback to be created and closes modal]
     * @return {[type]} [description]
     */
    _handleSave = () => {
        const {
            saveCallback,
            resolution,
            frames,
            format,
            output_path,
            compositing,
            samples,
            task_type
        } = this.props;
        const { name } = this.state;

        function getPresentObject(type) {
            switch (type) {
                case taskType.BLENDER:
                case taskType.BLENDER_NVGPU:
                    return {
                        resolution,
                        frames,
                        format,
                        output_path,
                        compositing,
                        samples
                    };
                case taskType.LUXRENDER:
                    return {
                        resolution,
                        format,
                        output_path,
                        compositing,
                        sample_per_pixel
                    };
            }
        }

        saveCallback(name, getPresentObject(task_type));
        this.props.closeModal("presetModal");
    };

    render() {
        const {
            resolution,
            frames,
            format,
            output_path,
            compositing,
            samples,
            task_type
        } = this.props;
        return (
            <div className="container__modal task-preset-modal ">
                <div className="content__modal">
                    <section className="section__naming">
                        <h4>Name your Preset</h4>
                        <input
                            id="nameInput"
                            type="text"
                            onChange={this._handleNameInput}
                            required
                        />
                    </section>
                    <section className="section__info">
                        <h5>Dimensions</h5>
                        <span>
                            {resolution && resolution[0]} x{" "}
                            {resolution && resolution[1]}
                        </span>
                        <ConditionalRender showIf={task_type.includes(taskType.BLENDER)}>
                            <h5>Frame Range</h5>
                            <span>{frames}</span>
                        </ConditionalRender>
                        <h5>Format</h5>
                        <span>{format} File</span>
                        <h5>Output to</h5>
                        <span>{output_path}</span>
                        <ConditionalRender showIf={task_type.includes(taskType.BLENDER)}>
                            <h5>Sample per pixel</h5>
                            <span>{samples}</span>
                        </ConditionalRender>
                    </section>
                    <div className="action__modal">
                        <span
                            className="btn--cancel"
                            onClick={this._handleCancel}>
                            Cancel
                        </span>
                        <button
                            type="button"
                            className="btn--primary"
                            onClick={this._handleSave}
                            autoFocus>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
