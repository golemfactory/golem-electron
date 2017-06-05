import React from 'react';

export default class PresetModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            name: null
        }
    }

    _handleNameInput(e) {
        this.setState({
            name: e.target.value
        })
    }

    _handleCancel() {
        this.props.closeModal()
    }

    _handleSave() {
        const {saveCallback, resolution, frames, format, output_path, compositing} = this.props
        const {name} = this.state
        saveCallback(name,
            {
                resolution,
                frames,
                format,
                output_path,
                compositing
            })
        this.props.closeModal()
    }

    render() {
        const {resolution, frames, format, output_path, compositing} = this.props
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
                        <h5>Frame Range</h5>
                        <span>{frames}</span>
                        <h5>Format</h5>
                        <span>{format} File</span>
                        <h5>Output to</h5>
                        <span>{output_path}</span>
                        <h5>Blender Compositing</h5>
                        <span>{compositing ? 'On' : 'Off'}</span>
                    </section>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button className="btn--primary" onClick={::this._handleSave}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
