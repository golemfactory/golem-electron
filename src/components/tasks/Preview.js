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
    _handleExpand(id, frameCount) {
        this.props.setPreviewExpanded({
            isScreenOpen: true,
            id,
            frameCount
        })
    }

    render() {
        const {id, src, frameCount} = this.props
        console.log("src", id, src);
        return (
            <div className="section__preview-black">
                {id && <ReactTooltip placement="bottomRight" trigger={['hover']} overlay={<p>Preview Window</p>} mouseEnterDelay={1} align={{
                offset: [0, 10],
            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                    <span className="button__expand icon-new-window" onClick={this._handleExpand.bind(this, id, frameCount)} onKeyDown={(event) => {
                event.keyCode === 13 && this._handleExpand.call(this)
            }} role="button" aria-label="Open Detailed Preview Window" tabIndex="0"></span>
                                </ReactTooltip>}
                <img src={src ? `file://${src}?${new Date().getTime()}` : 'error'} alt="Task Preview" ref={img => this.img = img} onError={
            () => this.img.src = 'http://golem.network/img/golem.png'}/>
            </div>
        );
    }
}
