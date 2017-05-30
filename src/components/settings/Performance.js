import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

const mapStateToProps = state => ({
    chart: state.performance.charts,
    loadingIndicator: state.performance.loadingIndicator
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

const mockList = [
    {
        icon: 'icon-macbook',
        title: 'i5-6267'
    },
    {
        icon: 'icon-luxrender',
        title: 'Luxrender'
    },
    {
        icon: 'icon-blender-grey',
        title: 'Blender'
    }
]

export class Performance extends React.Component {

    constructor(props) {
        super(props);
    }

    _handleRecount() {
        this.props.actions.recountBenchmark()
    }

    loadList(data, chart) {
        return data.map(({icon, title}, index) => <div className="list-item__performance" key={index.toString()}>
            <span className={'icon__list-item__acount ' + icon}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
            </span>
            <span className="title__list-item__acount">{title}</span>
            <progress value={(chart[Object.keys(chart)[index]] / 10000) * 100} max="100"></progress>
            <span className="amount__list-item__performance">{Math.trunc(chart[Object.keys(chart)[index]])}</span>
        </div>)
    }

    render() {
        const {chart, loadingIndicator} = this.props
        return (
            <div className="content__performance">
                <div className="list__performance">
                    {this.loadList(mockList, chart)}
                </div>
                <button className={`btn--outline ${loadingIndicator && 'btn--loading'}`} onClick={::this._handleRecount}> {loadingIndicator ? 'Calculating...' : 'Calculate' }{loadingIndicator && <span className="icon-progress"></span> }</button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Performance)