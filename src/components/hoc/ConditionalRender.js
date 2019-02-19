import React, { Component } from 'react'

export default class ConditionalRender extends Component {

    render() {
    	const { children, showIf } = this.props;
    	if(showIf){
		    const childrenWithProps = React.Children.map(children, (child) =>
		      React.cloneElement(child, { key: child.type.name })
		    );
	        return (childrenWithProps);
      	}
      	return (null);
    }
}