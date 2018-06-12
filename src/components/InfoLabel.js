import React, { Component } from 'react'
import ReactTooltip from 'rc-tooltip'

/**
 * { Class for not found(404) component. }
 *
 * @class      NotFound (name)
 */
export default class InfoLabel extends Component {

	_initLabel(_type, _label, _infoHidden){
		let labelContent = [_label]

		if(!_infoHidden)
			labelContent.push(<span key={3} className="icon-question-mark"/>);

		const title = React.createElement(_type, { className: 'info-title', key:"1"}, labelContent);
		return title
	}

    render() {
    	const {info, type, label, cls, infoHidden} = this.props
        return (
            <div className={`info-label__container ${cls}`}>
	            <ReactTooltip overlayClassName="black" placement="bottomLeft" trigger={['hover']} overlay={info} mouseEnterDelay={0.5} align={{
	                offset: [0, 10],
	            }} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
            		{this._initLabel(type, label, infoHidden)}
	            </ReactTooltip>
            </div>
        );
    }
}