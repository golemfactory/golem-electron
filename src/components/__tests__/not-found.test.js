jest.unmock('../NotFound')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import NotFound from '../NotFound'


it('should render a notfound component', () => {
    const wrapper = shallow(
        <NotFound/>
    )
    expect(wrapper).toMatchSnapshot()
})