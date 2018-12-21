import React from 'react';
import { Redirect } from "react-router-dom";

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import * as Actions from '../../actions'
import ConcentToS from './../concent/ConcentToS'
import ConcentOnboarding from './../concent/Onboarding'

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
        concentTerms: state.info.concentTerms,
        concentSwitch: state.concent.concentSwitch,
        isOnboadingActive: !state.concent.hasOnboardingShown,
        showConcentToS: !state.info.isConcentTermsAccepted
    })

    const mapDispatchToProps = dispatch => ({
        actions: bindActionCreators(Actions, dispatch)
    })

    class ConcentOnboardingHoC extends React.Component {


        constructor(props) {
            super(props);
            this.state = {
                isOnboadingActive: props.isOnboadingActive,
                showConcentToS: props.showConcentToS
            }
        }

        componentWillReceiveProps(nextProps) {
            if(nextProps.showConcentToS !== this.props.showConcentToS){
                this.setState({
                    showConcentToS: nextProps.showConcentToS
                })
            }
            if(nextProps.isOnboadingActive !== this.props.isOnboadingActive){
                this.setState({
                    isOnboadingActive: nextProps.isOnboadingActive
                })
            }
        }

        _handleOnboardingDone = () => {
            const {actions, showConcentToS} = this.props
            actions.setConcentOnboardingShown()
            if(!showConcentToS){
                actions.toggleConcent(true, true)
            }
        }


        render() {
            const {concentSwitch, concentTerms} = this.props
            const {showConcentToS, isOnboadingActive} = this.state

            if(isOnboadingActive && concentSwitch){
                return <ConcentOnboarding handleOnboardingDone={this._handleOnboardingDone}/>
            }
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

