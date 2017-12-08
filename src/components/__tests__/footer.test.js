jest.unmock('../Footer')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import sinon from 'sinon'
import ConnectedFooter, {Footer} from '../footer'


describe('<Footer/>', () => {

    it('should render a footer component', () => {
        const wrapper = shallow(
            <Footer/>
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('should render a footer component', () => {
        const wrapper = mount(
            <Footer preview={false}/>
        )
        expect(wrapper.ref('previewSwitch').prop('defaultChecked')).toBe(false)
    })

});