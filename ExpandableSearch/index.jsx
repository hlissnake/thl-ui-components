import React, {Component} from 'react';
import {Input, NavItem, ButtonOutline, Button} from 'rebass';


class SearchInput extends Component {
	constructor() {
		super();
		this.bodyClickListener = this.bodyClickListener.bind(this);
	}
	
	componentDidMount() {
		this.refs.searchInput.addEventListener('keyup', (event) => {
			if (event.keyCode === 27) {
				// esc key
				this.props.triggerClose();
			} else if (event.keyCode === 13) {
				// enter key
				this.props.triggerClose();
				this.props.triggerSearch();
			}
		});
	}
	
	bodyClickListener(event) {
		if (this.refs.searchInput !== event.srcElement) {
			this.props.triggerClose();
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.expanded !== this.props.expanded) {
			if (nextProps.expanded) {
				this.refs.searchInput.focus();
				document.body.addEventListener('click', this.bodyClickListener);
			} else {
				document.body.removeEventListener('click', this.bodyClickListener);
			}
		}
	}
	
	componentWillUnmount() {
		document.body.removeEventListener('click', this.bodyClickListener);
	}
	
	render() {
		let {triggerClose, expanded, ...props} = this.props;
		return <input ref="searchInput" {...props}/>;
	}
}

export default class ExpandableSearch extends Component {
	static propTypes = {
		onSearch: React.PropTypes.func.isRequired
	};
	
	static contextTypes = {
		rebass: React.PropTypes.object
	};
	
	constructor() {
		super();
		this.state = {
			expanded: false,
			value: ''
		};
	}
	
	render() {
		let ButtonComponent = ButtonOutline;
		if (this.props.inverted) {
			ButtonComponent = Button;
		}
		return <div style={this.props.style}>
			<NavItem onClick={() => this.setState({expanded: true})} style={{padding: '8px 16px'}}>
				{this.props.children || 'Search'}
			</NavItem>
			<div style={{
				overflow: 'hidden',
				position: 'absolute',
				right: 0,
				top: 0,
				bottom: 0,
				left: ((this.state.expanded) ? 0 : '100%'),
				transition: 'left 0.3s ease-in-out',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'row'
			}}>
				<Input
					style={{
						backgroundColor: this.context.rebass.colors.white,
						color: this.context.rebass.colors.black,
						flex: '1 1 auto'
					}}
					is={SearchInput}
					triggerClose={() => this.setState({expanded: false})}
					expanded={this.state.expanded}
					placeholder="Search"
					type="search"
					name="search-input"
					label=""
					hideLabel={true}
					rounded='left'
					mb={0}
					value={this.state.value}
					onChange={(event) => this.setState({value: event.target.value})}
					triggerSearch={() => this.props.onSearch(this.state.value)}
				/>
				<ButtonComponent
					theme="primary"
					children={this.props.children || 'Search'}
					onClick={() => this.props.onSearch(this.state.value)}
					style={{marginLeft: -1, padding: '8px 16px'}}
					rounded='right'
					inverted={this.props.inverted}
				/>
			</div>
		</div>;
	}
}
