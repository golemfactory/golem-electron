jest.unmock('../App')

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { Router, Route, createMemoryHistory } from "react-router";

import TestUtils from 'react-addons-test-utils'
import configureStore from 'redux-mock-store';
import ConnectedApp, { App } from '../App'
import sinon from 'sinon'

const mockStore = configureStore({})
const history = createMemoryHistory("/test")
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
    expect(wrapper.props().history).toEqual(history)
})


describe('<App />', () => {
    const actions = {
        login: () => true
    }
    const wrapper = shallow(
        <App history={history} actions={actions}/>
    )
    it('renders one <Router /> component', () => {
        expect(wrapper.find(Router).length).toBe(1)
    });

    it('renders four <Route /> components', () => {
        expect(wrapper.find(Route).length).toBe(4)
    });

    it('should call componentDidMount', () => {
        sinon.spy(App.prototype, 'componentDidMount');
        expect(App.prototype.componentDidMount.calledOnce).toBe(false)
        const wrapper = mount(<App history={history} actions={actions}/>);
        expect(App.prototype.componentDidMount.calledOnce).toBe(true)
    })
});