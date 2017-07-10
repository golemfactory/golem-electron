import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'

const mapStateToProps = state => ({
    presetList: state.advanced.presetList
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})
// let specifiedElement;
export class ManagePresetModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            deletedItem: null
        }
    }

    // clickOutside(parent, event) {

    //     var isClickInside = (parent.contains(event.target) && !parent.isEqualNode(event.target));
    //     console.log(parent, event.target, parent.contains(event.target), !parent.isEqualNode(event.target))
    //     if (!isClickInside) {
    //         //the click was outside the parent, do something
    //         this._handleCancel()
    //     }
    // }

    // componentDidMount() {
    //     specifiedElement = this.refs.modalContent
    //     window.applicationSurface.addEventListener('click', this.clickOutside.bind(this, specifiedElement))
    // }

    // componentWillUnmount() {
    //     window.applicationSurface.removeEventListener('click', this.clickOutside.bind(this, specifiedElement))
    // }

    /**
     * [_handleCancel funct.]
     * @return nothing
     */
    _handleCancel() {
        this.props.closeModal()
    }

    /**
     * [_handleSelection func. will select object to be deleted.]
     * @param  {Object}         item        [Selected preset object]
     * @return nothing
     */
    _handleSelection(item) {
        this.setState({
            deletedItem: item
        })
    }

    /**
     * [_handleDelete func. will delete the preset object]
     * @return {[type]} [description]
     */
    _handleDelete() {
        const {deletedItem} = this.state
        let {actions} = this.props
        if (deletedItem) {
            actions.deleteAdvancedPreset(deletedItem)
        }
    }

    /**
     * [_handleClose funct. will close modal]
     * @return nothing
     */
    _handleClose() {
        this.props.closeModal()
    }

    /**
     * [_fillList func.]
     * @param  {Array}      presetList      [Preset list from redux store]
     * @return {DOM}                        [HTML List version of the preset list]
     */
    _fillList(presetList) {
        let list = presetList.map(item => item.name);
        //console.log('FILL', list)
        return list && list.map((item, index) => <div tabIndex="-1" className="item__preset-list" key={index.toString()} onClick={this._handleSelection.bind(this, item)}><span>{item}</span></div>)
    }

    render() {
        const {presetList} = this.props
        return (
            <div className="container__modal network-manage-preset-modal">
            <div className="content__modal">
                    <section className="section__presets">
                        <h5>Manage Presets</h5>
                        <div className="preset-list">
                            {this._fillList(presetList)}
                        </div>
                        <div className="dock__preset-list">
                                <span className="icon-minimize" onClick={::this._handleDelete}/>
                            </div>
                    </section>
                    <div className="action__modal">
                        <button type="submit" className="btn--outline" onClick={::this._handleClose}>Done</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagePresetModal)