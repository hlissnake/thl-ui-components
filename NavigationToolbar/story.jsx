import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import NavigationToolbar from './';
import RebassThemes from '../RebassThemes';
import { Button } from 'rebass';

storiesOf('NavigationToolbar', module)
.add('with text', () => (
	<RebassThemes style={{height: '9000px', marginTop: 50}}><NavigationToolbar onScroll={action('scrollUp')}><p>Test Title</p></NavigationToolbar><h1>Content Start</h1></RebassThemes>
))
.add('with buttons', () => (
	<RebassThemes style={{height: '9000px', marginTop: 50}}><NavigationToolbar onScroll={action('scrollUp')}><Button>Test Title</Button><Button>Test Title</Button></NavigationToolbar><h1>Content Start</h1></RebassThemes>
))
.add('alternate theme', () => (
	<RebassThemes theme={{colors: {primary: 'red', white: 'white'}}} style={{height: '9000px', marginTop: 50}}><NavigationToolbar onScroll={action('scrollUp')}><p>Test Title</p><Button>Test Button</Button></NavigationToolbar><h1>Content Start</h1></RebassThemes>
));
