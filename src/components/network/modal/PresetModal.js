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
        const {cpu, ram, disk} = this.props
        return (
            <div className="container__modal network-preset-modal ">
                <div className="content__modal">
                    <section className="section__naming">
                        <h4>Name your Preset</h4>
                        <input/>
                    </section>
                    <section className="section__info">
                    	<div>
                    		<h5>CPU</h5>
                    		<span>{cpu > 1 ? `${cpu} Cores` : `${cpu} Core`}</span>
                    	</div>
                    	<div>
                    		<h5>RAM</h5>
                    		<span>{ram} GB</span>
                    	</div>
                    	<div>
                    		<h5>Disk</h5>
                    		<span>{disk} GB</span>
                    	</div>
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
