import React from 'react';


// let specifiedElement;
export default class ManagePresetModal extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            deleteList: []
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

    _handleNameInput(e) {
        this.setState({
            name: e.target.value
        })
    }

    _handleCancel() {
        this.props.closeModal()
    }

    _handleDelete() {
        const {deleteList} = this.state
        if (deleteList.length > 0)
            deleteCallback()
        this.props.closeModal()
    }

    _fillList(list) {
        console.log('FILL', list)
        return list && list.map((item, index) => <div className="item__preset-list" key={index.toString()}><span>{item}</span></div>)
    }

    render() {
        const {data} = this.props
        return (
            <div ref="modalContent" className="container__modal network-manage-preset-modal">
            <div className="content__modal" onSubmit={::this._handleDelete}>
                    <section className="section__presets">
                        <h5>Manage Presets</h5>
                        <div className="preset-list">
                        	{this._fillList(data)}
                        	<div className="dock__preset-list">
                        		<span className="icon-minimize"/>
                        	</div>
                        </div>
                    </section>
                    <div className="action__modal">
                        <button type="submit" className="btn--outline" onClick={::this._handleDelete}>Done</button>
                    </div>
                </div>
            </div>
        );
    }
}
