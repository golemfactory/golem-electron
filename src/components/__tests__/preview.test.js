jest.unmock('../blender/Preview')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import configureStore from 'redux-mock-store';
import ConnectedPreview, { Preview } from '../blender/Preview'
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

    const data = {
        point: [32, 219],
        vs: [
            [
                [0, 0],
                [0, 149],
                [99, 149],
                [99, 74],
                [600, 74],
                [600, 0],
                [0, 0]
            ],
            [
                [0, 151],
                [0, 199],
                [600, 199],
                [600, 76],
                [101, 76],
                [101, 151],
                [0, 151]
            ],
            [
                [0, 201],
                [0, 315],
                [199, 315],
                [199, 201],
                [0, 201]
            ],
            [
                [201, 201],
                [201, 315],
                [399, 315],
                [399, 201],
                [201, 201]
            ],
            [
                [401, 201],
                [401, 315],
                [600, 315],
                [600, 201],
                [401, 201]
            ]
        ]
    }

    it('renders one container__preview div', () => {
        expect(wrapper.find('.container__preview').length).toBe(1)
    });

    it('renders one container__image div', () => {
        expect(wrapper.find('.container__image').length).toBe(1)
    });

    it('should call componentDidMount', () => {
        sinon.spy(Preview.prototype, 'componentDidMount');
        expect(Preview.prototype.componentDidMount.calledOnce).toBe(false)
        const wrapper = TestUtils.renderIntoDocument(<Preview />);
        expect(Preview.prototype.componentDidMount.calledOnce).toBe(true)
    })

    it('fn(overCanvas) should check if pointIn function calling', () => {

        const mock_event_data = {
            currentTarget: {
                offsetWidth: 457,
                offsetHeight: 240,
                width: 492,
                height: 258
            },
            nativeEvent: {
                offsetX: 9,
                offsetY: 90
            }
        }

        const mock_event_data2 = {
            currentTarget: {
                offsetWidth: 457,
                offsetHeight: 240,
                width: 492,
                height: 258
            },
            nativeEvent: {
                offsetX: 10,
                offsetY: 90
            }
        }

        let mockPreview = TestUtils.renderIntoDocument(<Preview path={data.vs}/>);

        sinon.spy(Preview.prototype, 'pointIn');
        mockPreview.overCanvas(mock_event_data)
        expect(Preview.prototype.pointIn.calledOnce).toBe(true)
        mockPreview.overCanvas(mock_event_data2)
    })

    it('fn(pointIn) should check polygon if point in any of', () => {
        let mockPreview = TestUtils.renderIntoDocument(<Preview />);
        const result = 2
        expect(mockPreview.pointIn(data.point, data.vs)).toBe(result)
    })

    it('fn(draw) should draw polygon ', () => {
        let mockPreview = TestUtils.renderIntoDocument(<Preview path={data.vs}/>);
        expect(mockPreview.draw(data.vs[0])).toBe(true)
    })

});