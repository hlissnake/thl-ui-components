import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Style} from 'radium'
import Input from 'rebass/dist/Input';
import Base from 'rebass/dist/Base';
import Dropdown from 'rebass/dist/Dropdown';
import config from 'rebass/dist/config';

const animationSpeed = 200;

const SearchSelect = ({
	children:itemRender,
	open,
	onOpen,
	onChange,
	onNew,
	onSearchChange,
	searchResults,
	searching,
	searchElement,
	onDismiss,
	value = '',
	maxResults = 6,
	searchValue = '',
	styles = {},
	animationSpeed = 200,
	...props
}, {rebass, ...context}) => {
	let {scale, zIndex, colors} = {...config, ...context.rebass};
	const baseStyles = {
		dropdown: {
			base: {
				position: 'absolute',
				zIndex: zIndex[1],
				margin: 0,
				top: 0,
				left: 0,
				right: 0,
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				minWidth: 128,
				overflow: 'hidden',
				borderWidth: 1,
				borderStyle: 'solid',
				borderColor: 'rgba(0, 0, 0, 0.247059)',
				borderRadius: 2,
				color: colors.text,
				backgroundColor: colors.white,
				transition: `all ${animationSpeed / 1000.0}s`
			},
			open: {
				padding: (scale[1] / 2),
				left: -(scale[1] / 2),
				right: -(scale[1] / 2),
				top: -(scale[1] / 2),
				opacity: 1,
				boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.75)'
			},
			closed: {
				padding: 0,
				opacity: 0,
				boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)'
			}
		},
		dropdownMenu: {
			root: {
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: open ? 0 : '100%',
				zIndex: 4
			},
			overlay: {
				position: 'fixed',
				display: open ? null : 'none',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		}
	};
	styles.input = styles.input || {};
	styles.dropdown = styles.dropdown || baseStyles.dropdown;
	styles.dropdownMenu = styles.dropdownMenu || baseStyles.dropdownMenu;
	styles.dropdown.base = {
		...baseStyles.dropdown.base,
		...(styles.dropdown.base || {})
	};
	styles.dropdown.open = {
		...baseStyles.dropdown.open,
		...(styles.dropdown.open || {})
	};
	styles.dropdown.closed = {
		...baseStyles.dropdown.closed,
		...(styles.dropdown.closed || {})
	};
	styles.dropdownMenu.root = {
		...baseStyles.dropdownMenu.root,
		...(styles.dropdownMenu.root || {}),
		bottom: open ? 0 : '100%'
	};
	styles.dropdownMenu.overlay = {
		...baseStyles.dropdownMenu.overlay,
		...(styles.dropdownMenu.overlay || {}),
		display: open ? null : 'none'
	};
	
	let children;
	if (searching) {
		if (!searchElement) console.error('Warning: thl-ui-components/SearchSelect: searching was passed but no searchElement was passed');
		children = searchElement;
	} else if ((searchResults || []).length > 0) {
		children = searchResults.slice(0, maxResults).map(item => itemRender(item, () => onChange(item), false));
		if (children.length < maxResults && onNew) {
			children.push(itemRender(undefined, onNew, false));
		}
	} else {
		children = itemRender(undefined, onNew, false);
	}
	
	return <Dropdown>
		<Style rules={{
			'.OverlayFadeIn': styles.dropdown.base,
			'.OverlayFadeIn-Open:not(.OverlayFadeIn-enter):not(.OverlayFadeIn-leave), .OverlayFadeIn-enter-active, .OverlayFadeIn-leave': styles.dropdown.open,
			'.OverlayFadeIn-enter, .OverlayFadeIn-leave-active': styles.dropdown.closed
		}}/>
		{itemRender(value, onOpen, true)}
		<Base
			className='DropdownMenu'
			baseStyle={styles.dropdownMenu.root}>
			<div style={styles.dropdownMenu.overlay} onClick={onDismiss}/>
			<ReactCSSTransitionGroup transitionName="OverlayFadeIn" transitionEnterTimeout={animationSpeed} transitionLeaveTimeout={animationSpeed}>
				{open && <div key="menu" {...props} className={"OverlayFadeIn " + (open ? 'OverlayFadeIn-Open' : '')}>
					<Input value={searchValue} onChange={onSearchChange} label="" hideLabel name="search-input" style={styles.input}/>
					{children}
				</div>}
			</ReactCSSTransitionGroup>
		</Base>
	</Dropdown>;
};
SearchSelect.propTypes = {
	children: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	onOpen: PropTypes.func.isRequired,
	onDismiss: PropTypes.func.isRequired,
	maxResults: PropTypes.number,
	value: PropTypes.any,
	onChange: PropTypes.func,
	onNew: PropTypes.func,
	searchValue: PropTypes.string,
	onSearchChange: PropTypes.func,
	searchResults: PropTypes.array,
	searching: PropTypes.bool,
	searchElement: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.string,
		PropTypes.func
	]),
	styles: PropTypes.object,
	animationSpeed: PropTypes.number
};
SearchSelect.contextTypes = {
	rebass: PropTypes.object
};

export default SearchSelect;
