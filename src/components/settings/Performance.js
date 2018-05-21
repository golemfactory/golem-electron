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
        title: 'CPU'
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
//loadingIndicator && <span className="icon-progress"/>
export class Performance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            minPerf: 0
        }
    }

    componentDidMount() {
        this._setMinPerf(this.props.chart["estimated_blender_performance"])
    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.chart && (nextProps.chart["estimated_blender_performance"] !== this.props.chart['estimated_blender_performance'])){
            this._setMinPerf(nextProps.chart["estimated_blender_performance"])
        }
    }

    _setMinPerf(value){
        this.setState({
                minPerf: Math.trunc(value)
            }, () => this.refs.minPerf.value = this.state.minPerf)
    }

    /**
     * [_handleRecount func. sends request for the benchmark]
     */
    _handleRecount() {
        this.props.actions.recountBenchmark()
    }

    /**
     * [_applyMinPerformance func. sets minimum score of expected providers]
     */
    _applyMinPerformance(){

    }


    _handleMinPerfChange(e){
        this.setState({
            minPerf: e.target.value
        })
    }

    /**
     * [loadList func. populates performance items]
     * @param  {Array}      data        [List of performance items.]
     * @param  {Object}     chart       [Chart values of the performance items]
     * @return {DOM}                    [Performance item elements]
     */
    loadList(data, chart) {
        console.log("chart", chart);
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
        const {minPerf} = this.state
        return (
            <div className="content__performance">
                <div className="list__performance">
                    {this.loadList(mockList, chart)}
                </div>
                <button className={`btn--outline btn--calculate ${loadingIndicator && 'btn--loading'}`} onClick={::this._handleRecount} disabled={loadingIndicator}> {loadingIndicator ? 'Calculating' : 'Calculate' }{loadingIndicator && <span className="jumping-dots">
                      <span className="dot-1">.</span>
                      <span className="dot-2">.</span>
                      <span className="dot-3">.</span>
                    </span> }
                </button>
                <div className="content__min-score">
                    <span className="desc__min-score">To improve time of your task engage with nodes that have no less</span>
                    <div className="action__min-score">
                        <span className="icon-blender-grey">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                        </span>
                        <span>Blender score than:</span>
                        <input ref="minPerf" type="number" max="10000" defaultValue={minPerf} onChange={::this._handleMinPerfChange} disabled={chart['estimated_blender_performance'] === 0}/>
                        <button className="btn--outline" onClick={::this._applyMinPerformance} disabled={chart['estimated_blender_performance'] === 0}>Apply</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Performance)
