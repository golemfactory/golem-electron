import React from 'react';

const DotAnim = ({ children = "" }) => {
    return (
    	<span>
    		{children}
	        <span className="jumping-dots">
	          <span className="dot-1">.</span>
	          <span className="dot-2">.</span>
	          <span className="dot-3">.</span>
	        </span>
        </span>
    );
};

DotAnim.displayName = 'DotAnim';

export default DotAnim;
