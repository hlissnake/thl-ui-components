import React, {Component} from 'react';
import {Link} from 'react-router';
import {NavItem} from 'rebass';

export default function WrappedNavItem(props) {
	return <NavItem
		{...props}
		is={props.is || Link}
	/>;
}
