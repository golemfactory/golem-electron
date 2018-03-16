jest.unmock('../../network')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-dom/test-utils'
import configureStore from 'redux-mock-store';
import ConnectedMainFragment, { MainFragment } from '../../network'
import sinon from 'sinon'


const mockStore = configureStore()

it('should render a MainFragment component', () => {
    const wrapper = shallow(
        <Provider store={ mockStore({})}>
            <ConnectedMainFragment/>
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

describe('<MainFragment />', () => {
    const golemStatus = {status: true}

    const actions = {
        startLoading: (a, b) => true,
        endLoading: jest.fn(),
        login: (a) => a
    }

    it('should call componentDidMount', () => {
        const states = {
            realTime: {
                balance:[0, 0],
                golemStatus: {status: true}
            },
            input: {
                autoLaunch: false
            },
            info: {
                connectionProblem: false,
                isEngineOn: true
            },
            advanced: {
                chosenPreset: 'custom'
            },
            resources: {
                resource: 50
            },
            account: {
                publicKey: ""
            },
            currency: {
                GNT: 0, 
                ETH: 0
            }
        }

        sinon.spy(MainFragment.prototype, 'componentDidMount');
        expect(MainFragment.prototype.componentDidMount.calledOnce).toBe(false)
        const wrapper = mount(<Provider store={mockStore(states)}>
                                <ConnectedMainFragment actions={actions} />
                            </Provider>);
        expect(MainFragment.prototype.componentDidMount.calledOnce).toBe(true)
    })

    it('actions.endLoading is called once', function() {
        //let clock = jest.useFakeTimers();
        const states = {
            realTime: {
                balance:[],
                golemStatus: {status: true}
            },
            input: {
                autoLaunch: false
            },
            info: {
                connectionProblem: false,
                isEngineOn: true
            },
            advanced: {
                chosenPreset: 'custom'
            },
            resources: {
                resource: 50
            },
            account: {
                publicKey: ""
            },
            currency: {
                GNT: 0, 
                ETH: 0
            }
        }

        const props = {
                balance:[],
                golemStatus: { status: true },
                autoLaunch: false,
                connectionProblem: false,
                isEngineOn: true,
                chosenPreset: 'custom',
                resource: 50,
                publicKey: "",
                currency: {
                GNT: 0, 
                ETH: 0
            }
        }

        jest.useFakeTimers()
        // const wrapper = mount(<Provider store={mockStore(states)}>
        //                         <ConnectedMainFragment actions={actions} />
        //                     </Provider>);
        const wrapper = mount(<Provider store={mockStore(states)}>
                                <MainFragment actions={actions} {...props}/>
                            </Provider>);
        beforeEach(function() {
            actions.endLoading.mockClear();
        });
        jest.runAllTimers()
        expect(actions.endLoading).toBeCalled();
    });
})