jest.unmock('../Dropdown')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import sinon from 'sinon'
import Dropdown from '../Dropdown'


describe('<Dropdown/>', () => {

    const mockList = ['Golem', 'Network']

    it('should render a dropdown component', () => {
        const wrapper = shallow(
            <Dropdown 
                list={mockList} 
                selected={0} 
                handleChange={jest.fn} />
        )
        expect(wrapper).toMatchSnapshot()
    })

});