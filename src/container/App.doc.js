import React, { Component } from 'react'
import { Router, Route } from 'react-router'
import Header from '../components/Header'
import Doc from '../components/doc'
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
    <Route path="/doc" component={ LoadingComponent(Doc, ['DOC_LOADER'])[0]} />
    <Route path="*" component={ NotFound } status={404} />
</Route>
);


const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

/**
 * { Main Application Component. (Include Router) }
 *
 * @class      App (name)
 */
export class App extends Component {
    static propTypes = {
        actions: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
    }


    render() {

        const {actions, status, search, history} = this.props
        return (
            <div>
                <Header actions={ actions }/>
                <Router history={ history } >
                    { routes }
                </Router>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)