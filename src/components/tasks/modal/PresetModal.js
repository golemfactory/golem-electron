import React from 'react';

export default class PresetModal extends React.Component {


    constructor(props) {
        super(props);
    }

    _handleCancel() {
        this.props.closeModal()
    }

    _handleSave() {
        const {saveCallback, presetObj} = this.props
        saveCallback(presetObj)
        this.props.closeModal()
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal task-preset-modal ">
                <div className="content__modal">
                    <section className="section__naming">
                        <h4>Name your Preset</h4>
                        <input type="text" autoFocus required/>
                    </section>
                    <section className="section__info">
                        <h5>Dimensions</h5>
                        <span>3840 x 2160</span>
                        <h5>Frame Range</h5>
                        <span>01-05, 10-20, 45-70</span>
                        <h5>Format</h5>
                        <span>PNG File</span>
                        <h5>Output to</h5>
                        <span> ...Docs/Golem/Output</span>
                        <h5>Blender Compositing</h5>
                        <span>Off</span>
                    </section>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button className="btn--primary">Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
