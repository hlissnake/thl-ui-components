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
	onDismiss,
	value = '',
	styles = {},
	animationSpeed = 200,
	...props
}, {rebass}) => {
	let {scale, zIndex, colors} = {...config, ...rebass};
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
				{open && <SearchInput
					key="menu"
					{...props}
					children={itemRender}
					open={open}
					inputStyle={styles.input}
					className={"OverlayFadeIn " + (open ? 'OverlayFadeIn-Open' : '')}
				/>}
			</ReactCSSTransitionGroup>
		</Base>
	</Dropdown>;
};

class SearchInput extends Component {
	constructor() {
		super();
		this.state = {
			selected: 0
		};
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.searching) {
			this.setState({selected: 0});
		}
	}
	
	componentDidMount() {
		// the timeout prevents a double transition trigger for some reason
		setTimeout(() => this.input.focus());
	}
	
	render() {
		let {
			children:itemRender,
			onSearchChange,
			inputStyle,
			searching,
			searchElement,
			searchResults,
			onChange,
			onNew,
			maxResults = 6,
			searchValue = '',
			...props
		} = this.props;
		
		let children;
		if (searching) {
			if (!searchElement) console.error('Warning: thl-ui-components/SearchSelect: searching was passed but no searchElement was passed');
			children = searchElement;
		} else if ((searchResults || []).length > 0) {
			children = searchResults.slice(0, maxResults).map((item, index) => itemRender(item, () => onChange(item), false, index === this.state.selected));
			if (children.length < maxResults && onNew && (children.length === 0 || searchValue)) {
				let newIndex = children.length;
				children.push(itemRender(undefined, onNew, false, newIndex === this.state.selected));
			}
		} else {
			children = itemRender(undefined, onNew, false, true);
		}
		
		return <div {...props}>
			<Input
				baseRef={ref => this.input = ref}
				value={searchValue}
				onChange={onSearchChange}
				label=""
				hideLabel
				name="search-input"
				style={inputStyle}
				onKeyDown={this.inputKeyhandler.bind(this)}
			/>
			{children}
		</div>
	}
	
	inputKeyhandler(event) {
		let {maxResults = 6, searchResults = [], onNew, onChange} = this.props;
		let {selected} = this.state;
		if (event.keyCode === 13) {
			// enter key
			event.preventDefault();
			if (selected < maxResults && selected < searchResults.length && searchResults.length > 0) {
				onChange(searchResults[selected]);
			} else {
				onNew();
			}
		} else if (event.keyCode === 38) {
			// up arrow
			event.preventDefault();
			this.setState({selected: Math.max(0, selected - 1)});
		} else if (event.keyCode === 40) {
			// down arrow
			event.preventDefault();
			let maxIndex = Math.min(maxResults, searchResults.length);
			this.setState({selected: Math.min(maxIndex, selected + 1)});
		}
	}
}

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
