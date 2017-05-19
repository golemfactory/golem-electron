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
        handleChange && handleChange(list[selected].name)
    }

    select(item, index) {
        this.setState({
            listVisible: false,
            selectedIndex: index
        });
        this.props.handleChange(item.name)
    }

    show() {
        console.log('clicked')
        this.setState({
            listVisible: !this.state.listVisible
        });
    }

    hide() {
        this.setState({
            listVisible: false
        });
    }

    componentWillUnmount() {}

    renderListItems(list) {
        const {selectedIndex} = this.state
        console.log('LIST', list)
        return list.map((item, index) => <div key={index.toString()} className="item__dropdown" onClick={this.select.bind(this, item, index)}>
        <span className={selectedIndex === index ? 'selected' : ''}>{item.name}</span>
      </div>)
    }

    render() {
        const {selected, list} = this.props
        const {listVisible, selectedIndex} = this.state
        return (
            <div className="dropdown-container">
                <div className="dropdown-display" onClick={::this.show}>
                    <span>{list[selectedIndex].name}</span>
                </div>
                {listVisible && <div className="dropdown-list">
                                    <div>
                                        {this.renderListItems(list)}
                                    </div>
                                </div>}
            </div>
        );
    }
}
