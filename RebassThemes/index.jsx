import React from 'react';
require("font-awesome-webpack");

export default class CosmosComponents extends React.Component {
	static propTypes = {
		theme: React.PropTypes.object
	};
	
	static childContextTypes = {
		rebass: React.PropTypes.object
	};
	
	getChildContext() {
		return {
			rebass: {
				Button: {
					padding: '12px 8px',
					border: '1px solid black',
					borderRadius: '4px'
				},
				NavigationToolbar: {
					minHeight: 32
				},
				...(this.props.theme || {})
			}
		}
	}
	
	render() {
		let {theme, children, ...props} = this.props;
		return <div {...props}>{children}</div>;
	}
}
