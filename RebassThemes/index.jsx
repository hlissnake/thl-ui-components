import React from 'react';
import rebassConfig from 'rebass/src/config';
import color from 'color';

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
				...rebassConfig,
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
					primary: this.props.primaryColour || theme.colors.primary || rebassConfig.colors.primary
				},
				borderColors: {
					...theme.borderColors,
					primary: color(this.props.primaryColour || theme.colors.primary || rebassConfig.colors.primary).desaturate(1/74).darken(5/54).hexString()
				}
			}
		}
	}
	
	render() {
		let {theme, primaryColour, children, ...props} = this.props;
		return <div {...props}>{children}</div>;
	}
}
