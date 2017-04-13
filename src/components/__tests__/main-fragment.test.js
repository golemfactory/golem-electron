jest.unmock('../MainFragment')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import configureStore from 'redux-mock-store';
import ConnectedMainFragment, { MainFragment } from '../MainFragment'
import sinon from 'sinon'


const mockStore = configureStore()

it('should render a MainFragment component', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedMainFragment/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

describe('<MainFragment />', () => {
    const wrapper = shallow(
        <MainFragment/>
    )

    const actions = {
        startLoading: (a, b) => true,
        endLoading: jest.fn(),
        login: (a) => a
    }

    it('renders one content__main div', () => {
        expect(wrapper.find('.content__main').length).toBe(1)
    })

    it('should call componentDidMount', () => {
        sinon.spy(MainFragment.prototype, 'componentDidMount');
        expect(MainFragment.prototype.componentDidMount.calledOnce).toBe(false)
        const wrapper = mount(<MainFragment actions={actions} />);
        expect(MainFragment.prototype.componentDidMount.calledOnce).toBe(true)
    })

    it('actions.endLoading is called once', function() {
        //let clock = jest.useFakeTimers();
        jest.useFakeTimers()
        var wrapper = mount(<MainFragment actions={actions} />);
        beforeEach(function() {
            actions.endLoading.mockClear();
        });
        jest.runAllTimers()
        expect(actions.endLoading).toBeCalled();
    });

    it('should call componentDidMount', () => {
    })
})