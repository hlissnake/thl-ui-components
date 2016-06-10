import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import ToolbarOverflow from './';
import RebassThemes from '../RebassThemes';
import { Button } from 'rebass';

const buttons = [
	<Button key="1">Test Title1</Button>,
	<Button key="2">Test Title2</Button>,
	<Button key="3">Test Title3</Button>,
	<Button key="4">Test Title4</Button>,
	<Button key="5">Test Title5</Button>,
	<Button key="6">Test Title6</Button>,
	<Button key="7">Test Title7</Button>
];

storiesOf('ToolbarOverflow', module)
.add('default', () => (
	<ToolbarOverflow>{buttons}</ToolbarOverflow>
))
.add('appendStart', () => (
	<ToolbarOverflow appendStart={true}>{buttons}</ToolbarOverflow>
))
.add('max width 400', () => (
	<ToolbarOverflow style={{width: 400}}>{buttons}</ToolbarOverflow>
))
.add('max width 800', () => (
	<ToolbarOverflow style={{width: 800}}>{buttons}</ToolbarOverflow>
))
.add('first button greater than width', () => (
	<ToolbarOverflow style={{width: 400}}>{[<Button key="0" style={{marginRight: '20em'}}>Test Title1</Button>, ...buttons]}</ToolbarOverflow>
))
.add('custom overflowButton as Element', () => (
	<ToolbarOverflow style={{width: 400}} overflowButton={<Button>MOAR!!</Button>}>{buttons}</ToolbarOverflow>
))
.add('custom overflowButton as stateless function', () => (
	<ToolbarOverflow style={{width: 400}} overflowButton={props => <Button {...props}>MOAR!!</Button>}>{buttons}</ToolbarOverflow>
));
