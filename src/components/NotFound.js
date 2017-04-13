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
              <h3>The section you're looking for is ..mmh.. not here.<br/><span className="nf__sad"> :( </span></h3>
            </div>
        );
    }
}