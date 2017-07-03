import React from 'react';

export default class Dropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listVisible: false,
            selectedIndex: props.selected
        }
    }

    componentDidMount() {
        const {handleChange, list, selected} = this.props
        if (handleChange && list[selected]) {
            handleChange(list[selected].name, true)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.selected !== this.props.selected) {
            console.log("NEXT_PROPS", nextProps.selected)
            this.setState({
                selectedIndex: nextProps.selected
            });
        }
    }

    select(item, index) {
        this.setState({
            listVisible: false,
            selectedIndex: index
        });
        this.props.handleChange(item.name)
    }

    show() {
        this.setState({
            listVisible: !this.state.listVisible
        });
    }

    hide() {
        this.setState({
            listVisible: false
        });
    }

    _handleManageModal(list) {
        this.props.manageHandler()
        this.hide()
    }

    componentWillUnmount() {}

    renderListItems(list) {
        const {selectedIndex} = this.state
        return list.map((item, index) => <div key={index.toString()} className="item__dropdown" onClick={this.select.bind(this, item, index)}>
        <span className={selectedIndex === index ? 'selected' : ''}>{item.name}</span>
      </div>)
    }

    render() {
        const {selected, list, presetManager, disabled} = this.props
        const {listVisible, selectedIndex} = this.state
        return (
            <div className="dropdown-container">
                <div className="dropdown-display" onClick={!disabled && ::this.show}>
                    <span>{list[selectedIndex] ? list[selectedIndex].name : 'Not loaded'}</span>
                </div>
                {listVisible && <div className="dropdown-list">
                                    <div className="item-container__dropdown">
                                        {list.length > 0 ? this.renderListItems(list) : <span className="info__dropdown">There's no preset. You must create first.</span>}
                                    </div>
                                    {list.length > 0 && presetManager && <div className="option__dropdown">
                                        <div className="item__dropdown" onClick={::this._handleManageModal}>
                                            <span>Manage presets</span>
                                        </div>
                                    </div>}
                                </div>}
            </div>
        );
    }
}
