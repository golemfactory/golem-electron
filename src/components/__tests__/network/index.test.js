jest.unmock('../../network')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-dom/test-utils'
import configureStore from 'redux-mock-store';
import {BigNumber} from 'bignumber.js';
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
    const golemStatus = []

    const actions = {
        startLoading: (a, b) => true,
        endLoading: jest.fn(),
        login: (a) => a
    }

    it('should call componentDidMount', () => {
        const states = {
            realTime: {
                balance:[new BigNumber(0), new BigNumber(0)],
                golemStatus: ['client', 'start', 'pre']
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
            history: {
                historyList: []
            },
            resources: {
                resource: 50
            },
            performance: {
                environments: {}
            },
            account: {
                publicKey: ""
            },
            currency: {
                GNT: 0, 
                ETH: 0
            },
            stats: {
                stats: {
                    host_state: "",
                    subtasks_computed: [],
                    subtasks_accepted: [],
                    subtasks_rejected: [],
                    subtasks_with_timeout: [],
                    subtasks_with_errors: []
                }
            },
            concent: { 
                concentSwitch: false
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
                balance:[new BigNumber(0), new BigNumber(0)],
                golemStatus: ['client', 'start', 'pre']
            },
            info: {
                connectionProblem: false,
                isEngineOn: true
            },
            advanced: {
                chosenPreset: 'custom'
            },
            history: {
                historyList: []
            },
            resources: {
                resource: 50
            },
            performance: {
                environments: {}
            },
            account: {
                publicKey: ""
            },
            currency: {
                GNT: 0, 
                ETH: 0
            },
            input: {
                developerMode: false
            },
            stats: {
                stats: {
                    host_state: "",
                    subtasks_computed: [],
                    subtasks_with_timeout: [],
                    subtasks_with_errors: []
                }
            },
            concent: { 
                concentSwitch: false
            }
        }

        const props = {
                balance:[new BigNumber(0), new BigNumber(0)],
                status: { message: 'Starting Golem', status: 'Not Ready' },
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