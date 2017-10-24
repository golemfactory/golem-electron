import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

/**
 * { Class for creating tutorials with pointing objects. }
 *
 * @class      SpotLight (name)
 */
export default class SpotLight extends Component {

    render() {
    	const {posX, posY, r} = this.props
        return (
        	<Motion defaultStyle={{
                spotX: posX[0],
                spotY: posY[0],
                spotR: r[0]
            }} style={{
                spotX: spring(posX[1], {
                    stiffness: 100,
                    damping: 25
                }),
                spotY: spring(posY[1], {
                    stiffness: 100,
                    damping: 25
                }),
                spotR: spring(r[1], {
                    stiffness: 30,
                    damping: 6
                })
            }}>
            {({spotX, spotY, spotR}) => 
	            <svg className="spot-light" viewBox="0 0 100 100" width="100%">
				  <defs>
				    <mask id="mask" x="0" y="0" width="50" height="40">
				      <rect x="0" y="0" width="400" height="400" fill="#fff"/>
				      <circle cx={spotX} cy={spotY} r={spotR} />
				    </mask>
				  </defs>
				  <rect x="0" y="0" width="100" height="62" mask="url(#mask)" fillOpacity="0.7"/>    
				</svg>
			}
			</Motion>
        );
    }
}