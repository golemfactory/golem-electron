import React, { Component } from 'react'

/**
 * { Class for not found(404) component. }
 *
 * @class      NotFound (name)
 */
export default class NotFound extends Component {

    render() {
        return (
            <div className="nf__container">
              <h3>According to the fact that you got here, something must be going wrong.<br/><span className="nf__sad"> :( </span></h3>
            </div>
        );
    }
}