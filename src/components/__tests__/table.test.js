jest.unmock('../blender/Table')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTable from 'react-table'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import configureStore from 'redux-mock-store';
import ConnectedTable, { Table } from '../blender/Table'
import sinon from 'sinon'


const mockStore = configureStore()
describe('LoaderWrapper', () => {

    const blender_data = [
        {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.12',
            'price': 1.8e-05,
            'duration': 126,
            'progress': 100,
            'id': 0
        }, {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.13',
            'price': '0.001254',
            'duration': 4503,
            'progress': 100,
            'id': 1
        }, {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.18',
            'price': 4.1e-05,
            'duration': 330,
            'progress': 100,
            'id': 2
        }, {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.19',
            'price': 4.2e-05,
            'duration': 300,
            'progress': 100,
            'id': 3
        }
    ]



    const blender_data_updated = [
        {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.12',
            'price': 1.8e-05,
            'duration': 126,
            'progress': 100,
            'id': 0
        }, {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.13',
            'price': '0.001254',
            'duration': 4502,
            'progress': 100,
            'id': 1
        }, {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.18',
            'price': 4.1e-05,
            'duration': 330,
            'progress': 100,
            'id': 2
        }, {
            'status': 'Finished',
            'hash': '4c7065e4-453...',
            'name': 'Blender_01.19',
            'price': 4.2e-05,
            'duration': 300,
            'progress': 100,
            'id': 3
        }
    ]

    it('should render a table component', () => {
        const wrapper = shallow(
            <Provider store={ mockStore({})}>
            <ConnectedTable/>
        </Provider>
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('should covert seconds to hours', () => {
        let mockTable = TestUtils.renderIntoDocument(<Table />);
        expect(mockTable.convertSecsToHrsMinsSecs(62)).toBe("00:01:02")
    })

    it('should print print console.log about clicked row', () => {
        const mockData = ['event', 'item', 'index']
        let mockTable = TestUtils.renderIntoDocument(<Table />);
        expect(mockTable._handleRowClick(...mockData)).toBe(true)
    });

    it('should print create list of data', () => {

        const mockData = [{
            progress: 60,
            name: 'test',
            duration: 271,
            price: 10
        }]
        let mockTable = TestUtils.renderIntoDocument(<Table blender_data={mockData}/>);
        console.log(mockTable.listTasks(mockData).props.children[0]);
        expect(mockTable.listTasks(mockData).props.className).toBe('task-list')
    });
/*
    it('should call componentWillUpdate', () => {
        sinon.spy(Table.prototype, 'componentWillUpdate');
        expect(Table.prototype.componentWillUpdate.calledOnce).toBe(false)
        const wrapper = mount(<Table blender_data={blender_data}/>);
        wrapper.setProps({
            blender_data: blender_data_updated,
        })
        expect(Table.prototype.componentWillUpdate.calledOnce).toBe(true)
    })
*/
})