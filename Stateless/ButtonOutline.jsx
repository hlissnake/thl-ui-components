import React from 'react';
import Button from './Button';

/**
 * A general purpose outline style button element with customizable colors
 */

const ButtonOutline = ({
	style,
	theme,
	color,
	...props
}, {rebass}) => {
	const sx = {
		backgroundColor: 'transparent',
		color: rebass.colors[theme] || color,
		...style
	};
	
	return (
		<Button
			{...props}
			theme={theme}
			_className={`ButtonOutline ButtonOutline_${theme}`}
			style={sx}/>
	);
};

ButtonOutline.propTypes = {
	/** Pass an href prop to make the ButtonOutline an <a> tag instead of a <button> */
	href: React.PropTypes.string,
	/** Text color */
	color: React.PropTypes.string,
	/** Controls the border radius for creating button groups */
	rounded: React.PropTypes.oneOfType([
		React.PropTypes.bool,
		React.PropTypes.oneOf([
			'top',
			'right',
			'bottom',
			'left'
		])
	]),
	/** Creates a pill style button */
	pill: React.PropTypes.bool,
	/** Creates a larger button */
	big: React.PropTypes.bool
};

ButtonOutline.defaultProps = {
	color: 'primary',
	inverted: false,
	rounded: true
};

ButtonOutline.contextTypes = {
	rebass: React.PropTypes.object
};

export default ButtonOutline;
