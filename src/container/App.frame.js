import React, { Component } from 'react'
import { Router, Route } from 'react-router'
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
<Route component={ App } >
    <Route path="/preview/:type" component={ LoadingComponent(Frame, ['FRAME_LOADER'])[0]}>
        <Route path="/preview/:type/:id(/:frameID)"  component={ LoadingComponent(Frame, ['FRAME_LOADER'])[0]}/>
    </Route>
    <Route path="*" component={ NotFound } status={404} />
</Route>
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
                <Router history={ history } >
                    { routes }
                </Router>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)