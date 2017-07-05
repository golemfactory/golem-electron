import React from 'react';
import { findDOMNode } from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../../actions'

import SingleFrame from './Single'
import AllFrame from './All'


const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})


/**
 * { Class for Frame component. }
 *
 * @class      Frame (name)
 */
export class Frame extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const {actions} = this.props;
        //console.dir(this.props)
        actions.loginFrame(this.props.params.id)
        const endLoading = () => {
            actions.endLoading("FRAME_LOADER")
        // To replay animation
        /*Object.keys(require.cache).forEach(function(key) {
            delete require.cache[key]
        })*/
        }

        actions.startLoading("FRAME_LOADER", "I am loading!")
        setTimeout(endLoading, 5000)
    }

    /**
     * @description second windows screens changing based on react-route
     * Template:        {url}/preview/{type}/{id}   ( {id} necessary for SingleFrame )
     * SingleFrame:     {url}/preview/single/{id}
     * AllFrame:        {url}/preview/all
     * CompleteFrame:   {url}/preview/complete
     */

    render() {
        const {type, id, frameID} = this.props.params;
        //console.log("type", type);
        return (
            <div className="container__frame">
                {type !== 'single' ? <AllFrame show={type}/> : <SingleFrame id={id} frameID={frameID}/>}
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Frame)
