import React from 'react';
import { Link } from 'react-router'
/**
 * @see http://react-component.github.io/tooltip/
 */
import ReactTooltip from 'rc-tooltip'

export default class Preview extends React.Component {


    constructor(props) {
        super(props);
    }

    /**
     * [_handleExpand new-window expand handler]
     */
    _handleExpand() {
        this.props.setPreviewExpanded(true)
    }

    render() {
        return (
            <div className="section__preview-black">
                <ReactTooltip placement="bottomRight" trigger={['hover']} overlay={<p>Preview Window</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }}>
                    <span className="button__expand icon-new-window" onClick={::this._handleExpand}></span>
                </ReactTooltip>
                <img src="http://golem.network/img/golem.png"/>
            </div>
        );
    }
}
