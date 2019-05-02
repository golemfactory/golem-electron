import React from 'react'
import uuid from 'uuid/v4'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Spring } from 'react-spring/renderprops.cjs'

import * as Actions from '../../actions'
import golem_logo from './../../assets/img/golem-black.svg'

/**
 * { Class for loading Component which we will see while real component loading. }
 *
 * @class      Loading (name)
 */
export class Loading extends React.Component {

    componentDidMount() {
        require('../animation')
    }

    /**
     * { runAnim function updates style of div with React-Spring }
     *
     * @param      {number}     rotate  Transform attribute 
     * @param      {number}     alpha   Opacity attribute
     * @return     {Object}     { style object to change style }
     */
    runAnim(rotate, alpha) {
        return {
            transform: `translate(-50%, ${rotate}%)`,
            opacity: `${alpha}`
        }
    }

    render() {
        let mainButtonRotation = {
            rotate: -24,
            alpha: 1,
        };
        let defaultMainButtonRotation = {
            rotate: 0,
            alpha: 0
        }

        return (
            <div className="content__loading">
            <canvas id="stage" className="canvas" width="1534" height="841" style={{
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }}></canvas>
            <Spring 
                from={defaultMainButtonRotation} 
                to={mainButtonRotation} 
                delay={1000}
                config={{ tension: 10, friction: 50 }}>
                    {({rotate, alpha}) => <div className="title" style={this.runAnim(rotate, alpha)}>
                                <img src={golem_logo} />
                                <div className="text"> worldwide
                                    <br/> supercomputer
                                </div>
                                <div id="loading" className="loading">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
            }
                </Spring>
            </div>
        )
    }
}

/**
 * { HIGH ORDER COMPONENT }
 * { Loading component will redirect user to the loading screen while related component loading. }
 *
 * @class      LoadingComponent(name)
 * @param      {React Component}        ComposedComponent   The composed component which is we waiting for; see router in Container/App.js
 * @param      {Array}                  loadingIdArray      The loading identifier array
 * @return     {Array{ConnectedComponent, Component}}                        { Returning connected component (Redux) and Component (for testing)}
 */
export var LoadingComponent = function(ComposedComponent, loadingIdArray) {


    const mapStateToProps = state => ({
        loader: state.loader
    })

    const mapDispatchToProps = dispatch => ({
        actions: bindActionCreators(Actions, dispatch)
    })

    class Loader extends React.Component {

        constructor(props) {
            super(props);
        }

        componentWillMount() {
            let loadingId = uuid()
            this.loadingId = loadingId
            this.loadingIdArray = loadingIdArray ? [loadingId, ...loadingIdArray] : [loadingId]
        }

        _handleStartLoading(loadingText) {
            this.props.actions.startLoading(this.loadingId, loadingText)
        }

        _handleEndLoading(loadId) {
            this.props.actions.endLoading(loadId ? loadId : this.loadingId)
            return false
        }

        render() {
            let {loader, actions} = this.props
            let {loadingId, loadingIdArray} = this
            let passToChild = {
                startLoading: this._handleStartLoading,
                endLoading: this._handleEndLoading,
                loadingIdArray,
                loadingId
            }
            let loadingObject
            loadingIdArray.forEach((id) => {
                let loadObj = loader && loader[id];
                if (loadObj && loadObj.isLoading) {
                    loadingObject = loadObj;
                }
            });
            let isLoading = false

            if (loadingObject && loadingObject.isLoading) {
                isLoading = true
            }

            let styleOne = !isLoading ? {
                display: 'none'
            } : {}
            let styleTwo = isLoading ? {
                display: 'none'
            } : {}

            return (
                <div>
          <div style={{
                    width: '100%', ...styleOne
                }}>
            <Loading loadingText={loadingObject ? loadingObject.text : "Loading..."}/>
          </div>
          <div style={{
                    width: '100%', ...styleTwo
                }}>

                <ComposedComponent {...this.props} {...passToChild}/>
          </div>
        </div>
            );
        }
    }

    return [connect(mapStateToProps, mapDispatchToProps)(Loader), Loader]
}




