jest.unmock('../footer')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import sinon from 'sinon'
import ConnectedFooter, {Footer} from '../footer'


describe('<Footer/>', () => {

    const props = {
        status: {client: {message: ""}},
        connectionProblem: {status: ""}
    }

    it('should render a footer component', () => {
        const wrapper = shallow(
            <Footer {...props}/>
        )
        expect(wrapper).toMatchSnapshot()
    })
});