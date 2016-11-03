import React, {Component} from 'react';
// Uncomment when https://github.com/ReactTraining/react-router/pull/4121 is merged in. Not fixed as of alpha5
// import Link from 'react-router/Link';
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
			throw new Error('Error on Nav Item, to not defined');
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

// Remove when Above Link issue is fixed

import {LocationSubscriber} from 'react-router/Broadcasts'
import {
	routerContext as routerContextType
} from 'react-router/PropTypes'

class Link extends React.Component {
	static defaultProps = {
		replace: false,
		activeOnlyWhenExact: false,
		className: '',
		activeClassName: '',
		style: {},
		activeStyle: {},
		isActive: (location, to, props) => {
			return pathIsActive(
					to.pathname,
					location.pathname,
					props.activeOnlyWhenExact
				) && queryIsActive(
					to.query,
					location.query
				)
		}
	}
	
	static contextTypes = {
		router: routerContextType.isRequired
	}
	
	handleClick = (event) => {
		if (this.props.onClick)
			this.props.onClick(event)
		
		if (
			!event.defaultPrevented && // onClick prevented default
			!this.props.target && // let browser handle "target=_blank" etc.
			!isModifiedEvent(event) &&
			isLeftClickEvent(event)
		) {
			event.preventDefault()
			this.handleTransition()
		}
	}
	
	handleTransition = () => {
		const {router} = this.context
		const {to, replace} = this.props
		const navigate = replace ? router.replaceWith : router.transitionTo
		navigate(to)
	}
	
	render() {
		const {router} = this.context
		const {
			to,
			style,
			activeStyle,
			className,
			activeClassName,
			isActive: getIsActive,
			activeOnlyWhenExact, // eslint-disable-line
			replace, // eslint-disable-line
			children,
			...rest
		} = this.props
		
		return (
			<LocationSubscriber>
				{(location) => {
					const isActive = getIsActive(
						location,
						createLocationDescriptor(to),
						this.props
					)
					
					// If children is a function, we are using a Function as Children Component
					// so useful values will be passed down to the children function.
					if (typeof children == 'function') {
						return children({
							isActive,
							location,
							href: router ? router.createHref(to) : to,
							onClick: this.handleClick,
							transition: this.handleTransition
						})
					}
					
					// Maybe we should use <Match> here? Not sure how the custom `isActive`
					// prop would shake out, also, this check happens a LOT so maybe its good
					// to optimize here w/ a faster isActive check, so we'd need to benchmark
					// any attempt at changing to use <Match>
					return (
						<a
							{...rest}
							href={router ? router.createHref(to) : to}
							onClick={this.handleClick}
							style={isActive ? { ...style, ...activeStyle } : style }
							className={isActive ?
                [ className, activeClassName ].join(' ').trim() : className
              }
							children={children}
						/>
					)
				}}
			</LocationSubscriber>
		)
	}
}

// we should probably use LocationUtils.createLocationDescriptor
const createLocationDescriptor = (to) =>
	typeof to === 'object' ? to : {pathname: to}

const pathIsActive = (to, pathname, activeOnlyWhenExact) =>
	activeOnlyWhenExact ? pathname === to : new RegExp(to.replace(/(\/|\?)/ig, '\\$1') + '(\\/|\\?|#|$)').test(pathname)

const queryIsActive = (query, activeQuery) => {
	if (activeQuery == null)
		return query == null
	
	if (query == null)
		return true
	
	return deepEqual(query, activeQuery)
}

const isLeftClickEvent = (event) =>
event.button === 0

const isModifiedEvent = (event) =>
	!!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const deepEqual = (a, b) => {
	if (a == b)
		return true
	
	if (a == null || b == null)
		return false
	
	if (Array.isArray(a)) {
		return (
			Array.isArray(b) &&
			a.length === b.length &&
			a.every((item, index) => deepEqual(item, b[index]))
		)
	}
	
	if (typeof a === 'object') {
		for (let p in a) {
			if (!Object.prototype.hasOwnProperty.call(a, p)) {
				continue
			}
			
			if (a[p] === undefined) {
				if (b[p] !== undefined) {
					return false
				}
			} else if (!Object.prototype.hasOwnProperty.call(b, p)) {
				return false
			} else if (!deepEqual(a[p], b[p])) {
				return false
			}
		}
		
		return true
	}
	
	return String(a) === String(b)
}
