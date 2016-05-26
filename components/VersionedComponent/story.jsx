import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import VersionedComponent from './';

const TestVersion = (props) => {
	return <span {...props}>Version {props.version} resolved to {props.resolvedVersion}</span>;
}

const StateLess = (props) => {
	return <VersionedComponent {...props} components={{
		'1.1.0': TestVersion,
		'1.1.1': TestVersion,
		'1.1.2': TestVersion,
		'1.2.0': TestVersion,
		'2.0.2': TestVersion
	}}/>;
};

storiesOf('VersionedComponent', module)
.add('version 1.1.0', () => (
	<StateLess version="1.1.0"/>
))
.add('version ^0.4.0', () => (
	<StateLess version="^0.4.0"/>
))
.add('version ~1.1.0', () => (
	<StateLess version="~1.1.0"/>
))
.add('version ^2.0.0', () => (
	<StateLess version="^2.0.0"/>
));
