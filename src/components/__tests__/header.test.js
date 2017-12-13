jest.unmock('../Header')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import ConnectedHeader, { Header } from '../Header'


it('should render a header component', () => {
    const wrapper = shallow(
        <Header/>
    )
    expect(wrapper).toMatchSnapshot()
})