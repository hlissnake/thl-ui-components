import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StyleRoot} from 'radium';
import RebassThemes from '../RebassThemes';
import ProgressBar from './';

storiesOf('ProgressBar', module)
.addDecorator((story) => <StyleRoot><RebassThemes theme={{colors: {primary: 'green', error: 'red', warning: 'orange', white: 'white'}}}>{story()}</RebassThemes></StyleRoot>)
.add('defaults', () => (
	<ProgressBar percent={0.45}/>
))
.add('theme', () => (
	<ProgressBar percent={0.45} theme="warning"/>
))
.add('incrementTest', () => (
	<ProgressBar autoIncrement={true} percent={0}/>
))
.add('absolute', () => (
	<div style={{position: 'relative', width: 400, border: '2px solid red', padding: 20}}>
		<ProgressBar autoIncrement={true} percent={0} absolute/>
	</div>
));
