import React, { Component } from 'react'
import {Tooltip} from 'react-tippy';

/**
 * { Class for not found(404) component. }
 *
 * @class      NotFound (name)
 */
export default class InfoLabel extends Component {

	_initLabel(_type, _label){
		const title = React.createElement(_type, { className: 'info-title', key:"1"}, _label);
		return title
	}

    render() {
    	const {info, type, label, cls, infoHidden} = this.props
        return (
            <div className={`info-label__container ${cls}`}>
        	{infoHidden ? 
        			<Tooltip
                      html={info}
                      position="bottom"
                      trigger="mouseenter">
	            		{this._initLabel(type, label)}
		            </Tooltip>
	        	:
	            	[this._initLabel(type, label),
	            	<Tooltip
	            	  key="2"
                      html={info}
                      position="bottom"
                      trigger="mouseenter"
                      className="tip">
		                <span className="icon-question-mark"/>
		            </Tooltip>]
	        }
            </div>
        );
    }
}