import React, {Component} from 'react';
import {Link} from 'react-router';
import {NavItem} from 'rebass';

export default class WrappedNavItem extends Component {
	render() {
		return <NavItem
			{...this.props}
			is={this.props.is || Link}
		/>;
	}
}
