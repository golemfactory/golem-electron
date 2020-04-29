jest.unmock('../../tasks')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-dom/test-utils'
import configureStore from 'redux-mock-store';
import ConnectedTaskPanel, { TaskPanel } from '../../tasks'
import Table from '../../tasks/Table'
import sinon from 'sinon'


const mockStore = configureStore()

it('should render a task panel component', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedTaskPanel/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

describe('<Table />', () => {


    const actions = {
        startLoading: jest.fn(),
        endLoading: jest.fn(),
        getBlender: jest.fn(),
        setPreview: jest.fn()
    }

    const wrapper = shallow(
        <TaskPanel actions={actions} preview={true}/>
    )

    it('renders one section__table div', () => {
        expect(wrapper.find('.section__table').length).toBe(1)
    });

    it('renders one <Table /> components', () => {
        expect(wrapper.find(Table).length).toBe(1)
    });

    /*it('should call componentDidMount', () => {
        sinon.spy(Blender.prototype, 'componentDidMount');
        const wrapper = shallow(<Blender />);
        expect(Blender.prototype.componentDidMount.calledOnce).toBe(true)
    })*/
});