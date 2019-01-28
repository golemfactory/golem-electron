import React, { Component } from 'react';
import Lottie from 'react-lottie';
const { clipboard, remote } = window.electron;

import animData from './../assets/anims/error.json'

const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: animData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      error: null, 
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo){
    this.catchError(error, errorInfo)
  }

  _copyLogs = () => {
    const logTemplate = `
    Electron: ${remote.app.getVersion()}
    ${this.state.error.toString()}
    ${this.state.errorInfo.componentStack}
    `
    clipboard.writeText(logTemplate);
  }

  catchError = (error, errorInfo) => {
    this.setState({
      error,
      errorInfo
    })
  }

  handleError = () => {
  return (
    <div className="error-boundary">
      <div className="animContainer">
        <Lottie options={defaultOptions}/>
      </div>
      <div className="error-boundary__content">
      <h2>Something went wrong.</h2>
        <div className="snippet">
          {this.state.error && this.state.error.toString()}
          <br />
          {this.state.errorInfo.componentStack}
        </div>
        <div>
          <span>Please copy the log and let us know about the issue.</span>
        </div>
      </div>
      <div className="action-bar">
        <span className="action-bar__element" onClick={this._copyLogs}>
            <span className="icon-logs"/>
            <u>copy log</u>
        </span>
        <a className="action-bar__element" href="https://chat.golem.network">
            <span className="icon-chat"/>
            <u>golem chat</u>
        </a>
      </div>
    </div>
  )
}

  render() {
    if (this.state.errorInfo) return this.handleError()
    return this.props.children;
  }
}