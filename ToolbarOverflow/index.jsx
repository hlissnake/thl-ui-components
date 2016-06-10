import React from 'react';
import ReactDOM from 'react-dom';
import { NavItem, Dropdown, DropdownMenu, Arrow } from 'rebass';
import isFunction from 'lodash/isFunction';

export default class ToolbarOverflow extends React.Component {
	static contextTypes = {
		rebass: React.PropTypes.object
	};
	
	static propTypes = {
		overflowButton: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.element
		]),
		appendStart: React.PropTypes.bool,
		overflowButtonWidth: React.PropTypes.number
	};
	
	constructor(){
		super();
		this.state = {
			visibleChildren: undefined,
			dropdownChildren: undefined,
			dropdownOpen: false
		};
		this.calculateVisibleFromWidth = this.calculateVisibleFromWidth.bind(this);
	}
	
	componentDidReceiveProps() {
		if (this.state.totalChildren !== this.refs.root.childNodes.length ||
			this.state.width !== parseInt(window.getComputedStyle(this.refs.root).width) ||
			this.state.overflowButtonWidth !== (this.props.overflowButtonWidth || 80)
		){
			this.calculateVisibleFromWidth();
		}
	}
	
	componentDidMount() {
		this.calculateVisibleFromWidth();
		window.addEventListener('resize', this.calculateVisibleFromWidth);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.calculateVisibleFromWidth);
	}
	
	calculateVisibleFromWidth(){
		let toolbarWidth = parseInt(window.getComputedStyle(this.refs.root).width);
		let newState = {
			childWidthArray: this.state.childWidthArray || [],
			visibleChildren: [],
			dropdownChildren: [],
			totalChildren: this.props.children.length,
			width: toolbarWidth,
			overflowButtonWidth: this.props.overflowButtonWidth || 80,
			dropdownOpen: false
		};
		if (!newState.childWidthArray || newState.totalChildren !== this.state.totalChildren) {
			let childWidthArray = [].slice.call(this.refs.root.childNodes).map(element =>
				element.offsetWidth +
				parseInt(window.getComputedStyle(element).marginLeft) +
				parseInt(window.getComputedStyle(element).marginRight)
			);
			if (this.state.visibleChildren !== this.state.totalChildren) {
				if (this.props.appendStart) childWidthArray = childWidthArray.slice(1);
				else childWidthArray = childWidthArray.slice(0, childWidthArray.length - 1);
			}
			newState.childWidthArray = childWidthArray;
		}
		let children = React.Children.toArray(this.props.children);
		let totalChildLength = 0;
		for (var _c = 0; _c < newState.childWidthArray.length; _c++) {
			if (totalChildLength + newState.childWidthArray[_c] < toolbarWidth - newState.overflowButtonWidth) {
				newState.visibleChildren.push(React.cloneElement(children[_c], {key: _c}));
			} else {
				newState.dropdownChildren.push(React.cloneElement(children[_c], {key: _c}));
			}
			totalChildLength += newState.childWidthArray[_c];
		}
		if (totalChildLength < toolbarWidth) {
			newState.visibleChildren = [...newState.visibleChildren, ...newState.dropdownChildren];
			newState.dropdownChildren = [];
		}
		this.setState(newState);
	}
	
	render() {
		let {children, overflowButton, appendStart, ...props} = this.props;
		let onClick = () => this.setState({dropdownOpen: true});
		let trigger = <NavItem onClick={onClick}>more<Arrow direction="down"/></NavItem>;
		if (overflowButton) {
			if (isFunction(overflowButton)) {
				trigger = React.createElement(overflowButton, {onClick, dropdownShown: this.state.dropdownOpen});
			} else {
				trigger = React.cloneElement(overflowButton, {onClick});
			}
		}
		let dropdown = <Dropdown style={{float: (this.props.appendStart ? 'left': 'right')}}>
			{trigger}
			<DropdownMenu right={!this.props.appendStart} open={this.state.dropdownOpen} onDismiss={() => this.setState({dropdownOpen: false})}>
				{this.state.dropdownChildren}
			</DropdownMenu>
		</Dropdown>;
		let overflowStartDropdown, overflowEndDropdown;
		if (this.state.dropdownChildren && this.state.dropdownChildren.length > 0) {
			if (appendStart) {
				overflowStartDropdown = dropdown;
			} else {
				overflowEndDropdown = dropdown;
			}
		}
		return <div ref="root" {...props}>
			{overflowStartDropdown}{(this.state.visibleChildren && this.state.totalChildren === this.props.children.length) ? this.state.visibleChildren : children}{overflowEndDropdown}
		</div>;
	}
}
