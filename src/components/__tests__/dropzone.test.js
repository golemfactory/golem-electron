jest.unmock('../Dropzone')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-dom/test-utils'
import configureStore from 'redux-mock-store';
import ConnectedDropzone, { DropZone } from '../Dropzone'
import sinon from 'sinon'


const mockStore = configureStore()

it('should render a dropzone component', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedDropzone/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

describe('<DropZone />', () => {
    const wrapper = mount(
        <DropZone/>
    )

    const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
            files: [],
            items: []
        }
    }

    const actions = {
        uploadFile: jest.fn(),
        clearTaskPlain: jest.fn()
    }

    it('renders one drop-zone div', () => {
        expect(wrapper.find('.drop-zone').length).toBe(1)
    });

    it('fn(_onDragEnter) should change state as drop-zone--show', () => {

        let mockDropZone = TestUtils.renderIntoDocument(<DropZone taskList={[1, 2, 3]}/>);

        expect(mockDropZone.state.className).toBe('drop-zone--hide')
        mockDropZone._onDragEnter(mockEvent)
        expect(mockDropZone.state.className).toBe('drop-zone--show')
    });

    it('fn(_onDragOver) should return false', () => {

        let mockDropZone = TestUtils.renderIntoDocument(<DropZone taskList={[1, 2, 3]}/>);

        expect(mockDropZone.state.className).toBe('drop-zone--hide')
        mockDropZone._onDragOver(mockEvent)
        expect(mockDropZone._onDragOver(mockEvent)).toBe(false)
    });

    it('fn(_onDragLeave) should change state as drop-zone--hide', () => {

        let mockDropZone = TestUtils.renderIntoDocument(<DropZone taskList={[1, 2, 3]}/>);

        mockDropZone._onDragLeave(mockEvent)
        expect(mockDropZone.state.className).toBe('drop-zone--hide')
    });

    it('fn(_onDrop) should trigger uploadFile action', () => {

        let mockDropZone = mount(<DropZone actions={actions} taskList={[1, 2, 3]}/>);
        mockDropZone.instance()._onDrop(null, mockEvent)
        expect(mockDropZone.instance()._onDrop(null, mockEvent)).toBe(false)
    });

    it('should call componentDidMount', () => {
        sinon.spy(DropZone.prototype, 'componentDidMount');
        expect(DropZone.prototype.componentDidMount.calledOnce).toBe(false)
        const wrapper = mount(<DropZone />);
        expect(DropZone.prototype.componentDidMount.calledOnce).toBe(true)
    })

    it('should call componentWillUnmount', () => {
        sinon.spy(DropZone.prototype, 'componentWillUnmount');
        const wrapper = mount(<DropZone />);
        expect(DropZone.prototype.componentWillUnmount.calledOnce).toBe(false)
        wrapper.unmount();
        expect(DropZone.prototype.componentWillUnmount.calledOnce).toBe(true)
    })

});