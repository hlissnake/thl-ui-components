import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import ExpandableSearch from './';
import NavigationToolbar from '../NavigationToolbar';
import RebassThemes from '../RebassThemes';
import { Button } from 'rebass';

storiesOf('ExpandableSearch', module)
.add('with text', () => (
	<RebassThemes><ExpandableSearch onSearch={action('search for')}>Search Icon</ExpandableSearch></RebassThemes>
))
.add('inside NavigationBar', () => (
	<RebassThemes style={{height: '9000px', marginTop: 50}}>
		<NavigationToolbar onScroll={action('scrollUp')}>
			<Button>Test Title</Button>
			<Button>Test Title</Button>
			<ExpandableSearch inverted={true} onSearch={action('search for')}>Search Icon</ExpandableSearch>
	</NavigationToolbar><h1>Content Start</h1></RebassThemes>
));
