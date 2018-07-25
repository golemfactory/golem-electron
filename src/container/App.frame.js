import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom' // react-router v4
import { ConnectedRouter } from 'connected-react-router'

import Header from '../components/Header'
import Frame from '../components/tasks/frame'
import NotFound from '../components/NotFound'
import { LoadingComponent } from '../components/hoc/Loader'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../actions'



/**
 * { Router function to prepare component path }
 *
 * @return     {Route}
 */
const routes = (
<Switch>
    <Route path="/preview/:type/:id?"  component={ LoadingComponent(Frame, ['FRAME_LOADER'])[0]}/>
    <Route component={ NotFound } status={404} />
</Switch>
);


const mapStateToProps = state => ({
    status: state.firstReducer,
    search: state.setSearch,
    details: state.details.detail
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

/**
 * { Main Application Component. (Include Router) }
 *
 * @class      App (name)
 */
export class App extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {actions, status, search, history, details} = this.props
        return (
            <div>
                <Header actions={ actions }  activeHeader={'secondary'} taskDetails={details}/>
                <ConnectedRouter history={history}>
                    { routes }
                </ConnectedRouter>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)