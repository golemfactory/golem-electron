import React from 'react';
import { Redirect } from "react-router-dom";

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import * as Actions from '../../actions'
import ConcentToS from './../concent/ConcentToS'

/**
 * { HIGH ORDER COMPONENT }
 * { Onboarding component will check if user using the application first time or not}
 *
 * @class      ConcentToSComponent(name)
 * @param      {React Component}        ComposedComponent   The composed component which is we waiting for; see router in Container/App.js
 * @return     {ConnectedComponent>}                        { Returning connected component (Redux) }
 */
export var ConcentOnboardingComponent = function(ComposedComponent) {

    const mapStateToProps = state => ({
        showConcentToS: !state.info.isConcentTermsAccepted,
        concentTerms: state.info.concentTerms,
        concentSwitch: state.concent.concentSwitch
    })

    const mapDispatchToProps = dispatch => ({
        actions: bindActionCreators(Actions, dispatch)
    })

    class ConcentOnboardingHoC extends React.Component {


        constructor(props) {
            super(props);
        }

        componentWillMount() {}


        render() {
            const {concentSwitch, concentTerms, showConcentToS} = this.props
            if(showConcentToS && concentSwitch){
                return <ConcentToS {...this.props}/>
            }
            return (
                <div>
                    <ComposedComponent/>
                </div>
            )
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(ConcentOnboardingHoC);
}

