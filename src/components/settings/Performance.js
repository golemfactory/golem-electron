import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'

const mapStateToProps = state => ({
    chart: state.performance.charts,
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
        icon: 'icon-blender-grey',
        title: 'Blender'
    },
    {
        icon: 'icon-luxrenderer',
        title: 'Luxrenderer'
    }
]

export class Performance extends React.Component {

    constructor(props) {
        super(props);
    }

    _handleRecount() {

        console.log('COMPONENT_PERFORMANCE', 'Fired')
        this.props.actions.recountBenchmark('asd')
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
        const {chart} = this.props
        return (
            <div className="content__performance">
                <div className="list__performance">
                    {this.loadList(mockList, chart)}
                </div>
                <button className="btn--outline" onClick={::this._handleRecount}>Recount</button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Performance)