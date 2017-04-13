jest.unmock('../Footer')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import sinon from 'sinon'
import Footer from '../footer'


describe('<Footer/>', () => {

    it('should render a footer component', () => {
        const wrapper = shallow(
            <Footer/>
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('should render a footer component', () => {
        const setPreview = sinon.spy();
        const wrapper = mount(
            <Footer setPreview={setPreview}/>
        )
        wrapper.instance()._handlePreviewSwitch()
        expect(wrapper.props().setPreview.calledOnce).toBe(true)
    })


    it('should render a footer component', () => {
        const wrapper = mount(
            <Footer/>
        )
        expect(wrapper.ref('previewSwitch').prop('defaultChecked')).toBe(false)
    })

});