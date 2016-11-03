import React, {Component} from 'react';
import Link from 'react-router/Link';
import Base from 'rebass/dist/Base';
import config from 'rebass/dist/config';
import color from 'color';

export default function WrappedNavItem(_props, {rebass}) {
	if (_props.is) {
		return <NavItem {..._props}/>;
	} else {
		const {colors} = {...config, ...rebass}
		let {
			to, onClick, activeOnlyWhenExact, isActive,
			location, activeClassName, activeStyle, ...props
		} = _props;
		let linkProps = {
			to, onClick, activeOnlyWhenExact,
			isActive, location, activeClassName, activeStyle
		};
		if (!to) {
			console.log(_props);
			throw new Error('Error on Nav Item, "to" not defined');
		}
		return <Link
			{...linkProps}
		>{({isActive, location, href, onClick, transition, ...others}) => {
			let theme = props.theme, inverted = props.inverted;
			if (isActive) {
				if (activeClassName || activeStyle) {
					props.className = (props.className || '') + ' ' + (activeClassName || '');
					props.style = {...props.style, ...activeStyle};
				} else {
					props.style = {...props.style,
						backgroundColor: color(colors[theme] || colors.primary).alpha(0.6).rgbaString()
					};
					theme = theme || "primary";
					inverted = true;
				}
			}
			return <NavItem
				{...props}
				onClick={onClick}
				href={href}
				theme={theme}
				inverted={inverted}
			/>;
		}}</Link>;
	}
}
WrappedNavItem.contextTypes = {
	rebass: React.PropTypes.object
};

/**
 * Link for use in navigation. Inherits color
 * 
 * Override for additional className values
 */

const NavItem = ({
	small,
	className,
	...props
}, {rebass}) => {
	const {fontSizes, scale, bold} = {...config, ...rebass}
	className = ('NavItem ' + (className || '')).trim();
	return (
		<Base
			{...props}
			className={className}
			baseStyle={{
				fontSize: small ? fontSizes[6] : fontSizes[5],
				fontWeight: bold,
				lineHeight: '1rem',
				textDecoration: 'none',
				display: 'flex',
				alignItems: 'center',
				alignSelf: 'stretch',
				paddingTop: small ? scale[1] / 2 : scale[1],
				paddingBottom: small ? scale[1] / 2 : scale[1],
				paddingLeft: scale[1],
				paddingRight: scale[1],
				color: 'inherit',
				cursor: 'pointer'
			  }}
		/>
	)
}

NavItem.propTypes = {
	/** Sets a smaller font size for compact UI */
	small: React.PropTypes.bool,
	/** Root component - useful for use with react-router's Link component */
	is: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.object,
		React.PropTypes.func
	])
}

NavItem.defaultProps = {
	is: 'a'
}

NavItem.contextTypes = {
	rebass: React.PropTypes.object
}
