import React from 'react';

const mebi = 1 << 20

export default class PresetModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            name: null
        }
    }

    /**
     * [_handleNameInput func. will define saved preset name]
     * @param  {Event}          e
     */
    _handleNameInput(e) {
        this.setState({
            name: e.target.value
        })
    }

    /**
     * [_handleCancel func. will close modal]
     */
    _handleCancel() {
        this.props.closeModal()
    }

    /**
     * [_handleSave func. will save preset and close modal]
     * @param  {Event}      e
     */
    _handleSave(e) {
        e.preventDefault();
        const {saveCallback, cpu_cores, memory, disk} = this.props
        const {name} = this.state
        let memoryKiB = memory * mebi
        let diskKiB = disk * mebi
        saveCallback({
            name,
            cpu_cores,
            memory: memoryKiB,
            disk: diskKiB
        })
    }

    render() {
        const {cpu_cores, memory, disk, isNameExist} = this.props
        return (
            <div className="container__modal network-preset-modal ">
                <form className="content__modal" onSubmit={::this._handleSave}>
                    <section className="section__naming">
                        <h4>Name your Preset</h4>
                        {isNameExist && <span className="notice">Name is already exist</span>}
                        <input type="text" onChange={::this._handleNameInput} autoFocus required/>
                    </section>
                    <section className="section__info">
                        <div>
                            <h5>CPU</h5>
                            <span>{cpu_cores > 1 ? `${cpu_cores} Cores` : `${cpu_cores} Core`}</span>
                        </div>
                        <div>
                            <h5>RAM</h5>
                            <span>{memory} GiB</span>
                        </div>
                        <div>
                            <h5>Disk</h5>
                            <span>{disk} GiB</span>
                        </div>
                    </section>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button type="submit" className="btn--primary" autoFocus>Save</button>
                    </div>
                </form>
            </div>
        );
    }
}
