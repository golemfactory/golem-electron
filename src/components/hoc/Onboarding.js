import React from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion'

import * as Actions from '../../actions'
import Onboarding from './../onboarding';

/**
 * { HIGH ORDER COMPONENT }
 * { Onboarding component will check if user using the application first time or not}
 *
 * @class      OnBoardingComponent(name)
 * @param      {React Component}        ComposedComponent   The composed component which is we waiting for; see router in Container/App.js
 * @return     {ConnectedComponent>}                        { Returning connected component (Redux) }
 */
export var OnBoardingComponent = function(ComposedComponent) {

    const mapStateToProps = state => ({
        showOnboard: state.onboard.showOnboard
    })

    const mapDispatchToProps = dispatch => ({
        actions: bindActionCreators(Actions, dispatch)
    })

    class Onboarder extends React.Component {


        constructor(props) {
            super(props);
        }

        componentWillMount() {}


        render() {
            const {showOnboard} = this.props
            return (
                <div>
                    <div>
                        {showOnboard ? <Onboarding/> : <ComposedComponent/>}
                    </div>
                </div>
            )
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Onboarder);
}

