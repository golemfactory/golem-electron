jest.unmock('../hoc/Loader')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import TestUtils from 'react-dom/test-utils'
import configureStore from 'redux-mock-store';
import { LoadingComponent, Loading, Loader } from '../hoc/Loader'
import sinon from 'sinon'


const mockStore = configureStore()

describe('LoadingComponent Wrapper', () => {
    var wrapper,
        MockMainComponent,
        instance,
        set,
        WrapperComponent;

    beforeEach(() => {
        MockMainComponent = function Fake() {
                return (<div>Fake component</div>);
            }

        WrapperComponent = LoadingComponent(MockMainComponent)[0];
        wrapper = shallow(<Provider store={ mockStore({})}>
                                <WrapperComponent />
                          </Provider>)
        instance = wrapper.instance()
    });

    it('renders the Main Component as the root element', () => {
        expect(wrapper.first().is(WrapperComponent)).toBeTruthy()
    });
});

describe('Loader', () => {
    let MockMainComponent;
    let Loader;

    beforeEach(() => {
        MockMainComponent = function Fake() {
                return (<div>Fake component</div>);
            }

        Loader = LoadingComponent(MockMainComponent, ['BLENDER_LOADER'])[1]
    });

    const setup = () => {
        const loader = {
            BLENDER_LOADER: {
                "isLoading": true,
                "text": "I am loading!"
            }
        }

        const wrapper = shallow(<Loader loader={loader}/>)
        return {
            wrapper
        }
    }

    const actions = {
        startLoading: jest.fn(),
        endLoading: jest.fn(),
    }

    it('should render an Loading container', () => {
        const {wrapper} = setup()
    });

    it('should call actions.startLoading', () => {
        const mockLoader = TestUtils.renderIntoDocument(<Loader actions={actions}/>);
        const loadingId = [123]
        mockLoader._handleStartLoading(loadingId)
        expect(actions.startLoading).toBeCalled()
    });

    it('should call actions.endLoading', () => {
        const mockLoader = TestUtils.renderIntoDocument(<Loader actions={actions}/>);
        const loadingId = [123]
        mockLoader._handleEndLoading(loadingId)
        expect(actions.endLoading).toBeCalled()
    });
    
    it('should call componentWillMount', () => {
        sinon.spy(Loader.prototype, 'componentWillMount');
        expect(Loader.prototype.componentWillMount.calledOnce).toBe(false)
        const wrapper = mount(<Loader />);
        expect(Loader.prototype.componentWillMount.calledOnce).toBe(true)
    })
})

describe('Loading', () => {

    const setup = () => {
        const wrapper = shallow(<Loading/>)

        return {
            wrapper
        }
    }

    const actions = {
        startLoading: jest.fn(),
        endLoading: jest.fn(),
    }

    it('should render an Loading container', () => {
        const {wrapper} = setup()
        expect(wrapper).toMatchSnapshot()
    });

    it('should render a stage canvas for animation', () => {
        const {wrapper} = setup()
        expect(wrapper.find('#stage').length).toBe(1)
    });


    it('should return style with runAnim', () => {
        const style = {
            transform: "translate(-50%, 50%)",
            opacity: "0.6"
        }
        let mockLoading = TestUtils.renderIntoDocument(<Loading />);
        expect(mockLoading.runAnim(50, 0.6).toString()).toBe(style.toString())
    });

    it('should call componentDidMount', () => {
        sinon.spy(Loading.prototype, 'componentDidMount');
        expect(Loading.prototype.componentDidMount.calledOnce).toBe(false)
        const wrapper = mount(<Loading />);
        expect(Loading.prototype.componentDidMount.calledOnce).toBe(true)
    })
});

