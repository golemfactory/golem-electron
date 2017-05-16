import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions'
import Slider from './../../Slider.js'


const mapStateToProps = state => ({
    resource: state.resources.resource
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export class Resources extends React.Component {

    constructor(props) {
        super(props);
    }

    _setResource(value) {
        console.log("RESOURCE", value)
        this.props.actions.setResources(value)
    }

    render() {
        const {resource} = this.props
        return (
            <div className="content__resources">
                <Slider value={resource} iconLeft="icon-single-server" iconRight="icon-multi-server" callback={::this._setResource}/>
                <div className="slider__tips">
                        Use the slider to choose how much of your machine’s resources 
                    (CPU, RAM and disk space) Golem can use. More power means 
                    more potential income.
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resources)