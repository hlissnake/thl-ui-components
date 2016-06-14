import React from 'react';
import rebassConfig from 'rebass/src/config';
require("font-awesome-webpack");

export default class CosmosComponents extends React.Component {
	static propTypes = {
		theme: React.PropTypes.object,
		primaryColour: React.PropTypes.string
	};
	
	static childContextTypes = {
		rebass: React.PropTypes.object
	};
	
	getChildContext() {
		let theme = this.props.theme || {colors: {}};
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
				...theme,
				colors: {
					...rebassConfig.colors,
					...theme.colors,
					primary: this.props.primaryColour
				}
			}
		}
	}
	
	render() {
		let {theme, primaryColour, children, ...props} = this.props;
		return <div {...props}>{children}</div>;
	}
}
