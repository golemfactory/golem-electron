jest.unmock('../../tasks/Preview')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-dom/test-utils'
import configureStore from 'redux-mock-store';
import ConnectedPreview, { Preview } from '../../tasks/Preview'
import sinon from 'sinon'

const mockStore = configureStore()

it('should render a blender component', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedPreview/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

describe('<Preview />', () => {
    const wrapper = shallow(
        <Preview/>
    )

    it('renders one section__preview-black div', () => {
        expect(wrapper.find('.section__preview-black').length).toBe(1)
    });

    it('renders img element', () => {
        expect(wrapper.find('img').length).toBe(1)
    });

    // it('should call componentDidMount', () => {
    //     sinon.spy(Preview.prototype, 'componentDidMount');
    //     expect(Preview.prototype.componentDidMount.calledOnce).toBe(false)
    //     const wrapper = TestUtils.renderIntoDocument(<Preview />);
    //     expect(Preview.prototype.componentDidMount.calledOnce).toBe(true)
    // })

});