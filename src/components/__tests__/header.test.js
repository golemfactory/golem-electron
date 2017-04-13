jest.unmock('../Header')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Header from '../Header'


it('should render a header component', () => {
    const wrapper = shallow(
        <Header/>
    )
    expect(wrapper).toMatchSnapshot()
})