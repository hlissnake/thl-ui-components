import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import { Button } from 'rebass';
import RebassThemes from './';

storiesOf('RebassThemes', module)
.addDecorator((story) => <RebassThemes theme={{colors: {primary: 'green', error: 'red', warning: 'orange', white: 'white'}}}>{story()}</RebassThemes>)
.add('basic button', () => (
	<Button onClick={action('click')}>Should be Green</Button>
))
.add('warning button', () => (
	<Button theme="warning" onClick={action('click')}>Should Be Orange</Button>
))
.add('danger button', () => (
	<Button theme="error" onClick={action('click')}>Should Be Red</Button>
))
.add('override themeColor', () => (
	<RebassThemes theme={{colors: {primary: 'green', error: 'red', warning: 'orange', white: 'white'}}} primaryColour="blue"><Button theme="primary" onClick={action('click')}>Should Be Blue</Button></RebassThemes>
));
