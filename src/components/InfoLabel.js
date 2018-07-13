import React, { Component } from 'react'
import {Tooltip} from 'react-tippy';

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
    	const {info, type, label, cls, infoHidden, distance} = this.props
        return (
            <div className={`info-label__container ${cls}`}>
    			<Tooltip
                  html={info}
                  position="bottom"
                  trigger="mouseenter"
                  distance={distance}>
            		{this._initLabel(type, label, infoHidden)}
	            </Tooltip>
            </div>
        );
    }
}