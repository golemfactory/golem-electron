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
        this._isMounted = true
        const {handleChange, list, selected} = this.props
        if (handleChange && list[selected]) {
            handleChange(list[selected].name, true)
        }
        this._specifiedElement = this.refs.dropdownContent;
        this._clickOutside = this.clickOutside.bind(this, this._specifiedElement)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.selected !== this.props.selected) {
            this.setState({
                selectedIndex: nextProps.selected
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false
        window.applicationSurface.removeEventListener('click', this._clickOutside)
    }

    clickOutside(parent, event) {
        var isClickInside = (parent.contains(event.target) && !parent.isEqualNode(event.target));
        // console.log(parent, event.target, parent.contains(event.target), !parent.isEqualNode(event.target))
        if (!isClickInside) {
            //the click was outside the parent, do something
            this.hide()
        }
    }

    select(item, index) {
        this.setState({
            listVisible: false,
            selectedIndex: index
        }, () => {
            window.applicationSurface.removeEventListener('click', this._clickOutside)
        });
        this.props.handleChange(item.name, index)
    }

    show() {
        this.setState({
            listVisible: !this.state.listVisible
        }, () => {
            window.applicationSurface.addEventListener('click', this._clickOutside)
        });
    }

    hide() {
        if (this._isMounted)
            this.setState({
                listVisible: false
            }, () => {
                window.applicationSurface.removeEventListener('click', this._clickOutside)
            });
    }

    _handleManageModal(list) {
        this.props.manageHandler()
        this.hide()
    }

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
            <div ref="dropdownContent" className="dropdown-container">
                <div className="dropdown-display" onClick={!disabled ? ::this.show : undefined} disabled={disabled}>
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
