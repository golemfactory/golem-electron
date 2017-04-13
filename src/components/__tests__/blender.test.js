jest.unmock('../blender')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import configureStore from 'redux-mock-store';
import ConnectedBlender, { Blender } from '../blender'
import Table from '../blender/Table'
import Footer from './../Footer'
import sinon from 'sinon'


const mockStore = configureStore()

it('should render a blender component', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedBlender/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

describe('<Blender />', () => {


    const actions = {
        startLoading: jest.fn(),
        endLoading: jest.fn(),
        getBlender: jest.fn(),
        setPreview: jest.fn()
    }

    const wrapper = shallow(
        <Blender actions={actions} preview={true}/>
    )

    it('renders one section__table div', () => {
        expect(wrapper.find('.section__table').length).toBe(1)
    });

    it('renders one section__preview div', () => {
        expect(wrapper.find('.section__preview').length).toBe(1)
    });

    it('renders one <Table /> components', () => {
        expect(wrapper.find(Table).length).toBe(1)
    });

    it('renders four <Footer /> components', () => {
        expect(wrapper.find(Footer).length).toBe(1)
    });

    /*it('should call componentDidMount', () => {
        sinon.spy(Blender.prototype, 'componentDidMount');
        const wrapper = shallow(<Blender />);
        expect(Blender.prototype.componentDidMount.calledOnce).toBe(true)
    })*/
    it('actions.endLoading is called once', function() {
        //let clock = jest.useFakeTimers();
        jest.useFakeTimers()
        var wrapper = shallow(<Blender actions={actions} />);
        wrapper.instance().componentDidMount()
        beforeEach(function() {
            actions.endLoading.mockClear();
        });
        jest.runAllTimers()
        expect(actions.endLoading).toBeCalled();
    });
});