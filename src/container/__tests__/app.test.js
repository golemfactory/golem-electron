jest.unmock('../App')

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { routerMiddleware } from 'connected-react-router';
import {createHashHistory} from "history";

import TestUtils from 'react-dom/test-utils'
import { registerMiddlewares, buildInitialStoreState, registerInitialStoreState } from 'redux-actions-assertions';
import configureStore from 'redux-mock-store'
import ConnectedApp, { App } from '../App'
import createRootReducer from '../../reducers';
import sinon from 'sinon'

const history = createHashHistory("/test")
const routingMiddleware = routerMiddleware(history)
registerMiddlewares([
  routingMiddleware
]);
registerInitialStoreState(buildInitialStoreState(createRootReducer(history)));
const mockStore = configureStore([routingMiddleware])

const wrapper = shallow(
    <Provider store={ mockStore({})}>
            <ConnectedApp history={history}/>
        </Provider>
)
it('should render an App container', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedApp/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

it('should check history prop', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedApp history={history}/>
        </Provider>
    )

    expect(wrapper.dive().props().history).toEqual(history)
})


// describe('<App />', () => {
//     const actions = {
//         login: () => true
//     }
//     const wrapper = mount(
//         <Provider store={ mockStore({
//                 action: jest.fn(),
//                 info:{
//                     connectionProblem: {
//                         status: false,
//                         issue: null
//                     },
//                     isEngineOn: true
//                 },
//                 realTime:{
//                     connectedPeers: [],
//                     golemStatus: {
//                         status: false
//                     }
//                 },
//                 queue: {
//                     next: []
//                 },
//                 account: {
//                     withdrawModal: {
//                         status: false,
//                         currency: null
//                     }
//                 },
//                 onboard:{
//                     showOnboard: false
//                 },
//                 resources: {
//                     resource: 0
//                 },
//                 advanced: {
//                     chosenPreset: ""
//                 },
//                 stats: {
//                     stats: {
//                         host_state: "",
//                         subtasks_computed: [],
//                         subtasks_with_timeout: [],
//                         subtasks_with_errors: []
//                     }
//                 },
//                 actions: jest.fn()
//             })}>
//                 <ConnectedApp history={history}/>
//             </Provider>
//     )
//     it('renders one <Switch /> component', () => {
//         expect(wrapper.find(Switch).length).toBe(1)
//     });

//     it('renders four <Route /> components', () => {
//         expect(wrapper.find(Route).length).toBe(7)
//     });

//     it('should call componentDidMount', () => {
//         sinon.spy(App.prototype, 'componentDidMount');
//         expect(App.prototype.componentDidMount.calledOnce).toBe(false)
//         const wrapper = shallow(
//             <Provider store={ mockStore({
//                 info:{
//                     connectionProblem: {
//                         status: false,
//                         issue: null
//                     },
//                     isEngineOn: true
//                 },
//                 realTime:{
//                     connectedPeers: [],
//                     golemStatus: {
//                         status: false
//                     }
//                 },
//                 queue: {
//                     next: []
//                 },
//                 account: {
//                     withdrawModal: {
//                         status: false,
//                         currency: null
//                     }
//                 },
//                 onboard:{
//                     showOnboard: false
//                 },
//                 advanced: {
//                     chosenPreset: ""
//                 },
//                 stats: {
//                     stats: {
//                         host_state: "",
//                         subtasks_computed: [],
//                         subtasks_with_timeout: [],
//                         subtasks_with_errors: []
//                     }
//                 },
//                 actions: jest.fn()
//             })}>
//                 <ConnectedApp history={history}/>
//             </Provider>);
//         expect(App.prototype.componentDidMount.calledOnce).toBe(true)
//     })
// });