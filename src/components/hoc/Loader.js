import React from 'react'
import uuid from 'uuid/v4'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion'

import * as Actions from '../../actions'
import golem_logo from './../../assets/img/golem-black.png'

/**
 * { Class for loading Component which we will see while real component loading. }
 *
 * @class      Loading (name)
 */
export class Loading extends React.Component {

    state = {
        anim: false
    }

    componentWillMount() {
        setTimeout(() => (
        this.setState({
            anim: true
        })
        ), 1000)
    }

    componentDidMount() {
        require('../animation')
    }

    /**
     * { runAnim function updates style of div with React-Motion }
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
        let {anim} = this.state
        let mainButtonRotation = anim ? {
            rotate: spring(-24, {
                stiffness: 80,
                damping: 50
            }),
            alpha: spring(1, {
                stiffness: 80,
                damping: 80
            })
        } : {
            rotate: spring(0, {
                stiffness: 80,
                damping: 60
            }),
            alpha: spring(0, {
                stiffness: 80,
                damping: 80
            })
        }

        return (
            <div className="content__loading">
            <canvas id="stage" className="canvas" width="1534" height="841" style={{
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }}></canvas>
            <Motion style={mainButtonRotation}>
                    {({rotate, alpha}) => <div className="title" style={this.runAnim(rotate, alpha)}>
                                <img src={golem_logo} />
                                <div className="text"> worldwide
                                    <br/> supercomputer
                                </div>
                                <div className="loading">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
            }
                </Motion>
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
        static propTypes = {
            name: React.PropTypes.string,
        };

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




