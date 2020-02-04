jest.unmock('../FooterMain')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import sinon from 'sinon'
import ConnectedFooter, {FooterMain} from '../FooterMain'


describe('<Footer/>', () => {

    const props = {
        status: {client: {message: ""}},
        connectionProblem: {status: ""}
    }

    it('should render a footer component', () => {
        const wrapper = shallow(
            <FooterMain {...props}/>
        )
        expect(wrapper).toMatchSnapshot()
    })
});