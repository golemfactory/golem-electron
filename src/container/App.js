import React, { Component } from 'react'
import { Router, Route } from 'react-router'
import Header from '../components/Header'
import MainFragment from '../components/network'
import Tasks from '../components/tasks'
import Frame from '../components/tasks/frame'
import NewTask from '../components/tasks/NewTask'
import TaskDetail from '../components/tasks/TaskDetail'
import Settings from '../components/settings'
import NotFound from '../components/NotFound'
import { OnBoardingComponent } from '../components/hoc/Onboarding'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../actions'
import ConnectionModal from './modal/ConnectionModal'



/**
 * { Router function to prepare component path }
 *
 * @return     {Route}
 */
const routes = (
<Route component={ App } >
    <Route path="/" component={OnBoardingComponent(MainFragment)} /*component={ LoadingComponent(MainFragment, ['MAIN_LOADER'])[0]}*/ />
    <Route path="/tasks" component={Tasks} /*component={ LoadingComponent(Tasks, ['TASK_PANEL_LOADER'])[0]}*/ />
    <Route path="/task" component={ TaskDetail } >
        <Route path="/task/:id" component={ TaskDetail } />
    </Route>
    <Route path="/add-task/type(/:type)" component={ NewTask } />
    <Route path="/add-task/settings" component={ TaskDetail } />
    <Route path="/settings" component={ Settings } />
    <Route path="*" component={ NotFound } status={404} />
</Route>
);


const mapStateToProps = state => ({
    status: state.firstReducer,
    search: state.setSearch,
    connectionProblem: state.info.connectionProblem
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

    componentDidMount() {
        const {actions} = this.props
        actions.login('Muhammed')


    }

    _closeModal() {
        const {actions} = this.props
        actions.setConnectionProblem(false);
    }


    render() {

        const {actions, status, search, history, connectionProblem} = this.props
        return (
            <div>
                <Header actions={ actions } activeHeader={'main'}/>
                <Router history={ history } >
                    { routes }
                </Router>
                 {connectionProblem && <ConnectionModal closeModal={::this._closeModal}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)