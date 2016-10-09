import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import AuthPinModal from './';

const defaults = {
	open: true,
	unlockPin: '1111',
	onPinAuth: action('onPinAuth'),
	onCancel: action('onCancel'),
	onFailure: action('onFailure'),
	cancelText: 'cancel',
	maxTries: 4,
	errorMessage: (incorrectTries) => `${4 - incorrectTries} attempts remaining`,
	message: 'Enter Authentication Pin'
};

storiesOf('AuthPinModal', module)
.add('default', () => (
	<AuthPinModal {...defaults}/>
)).add('unlimited tries (false)', () => (
	<AuthPinModal {...defaults} maxTries={false}/>
)).add('unlimited tries (0)', () => (
	<AuthPinModal {...defaults} maxTries={0}/>
)).add('less inputs', () => (
	<AuthPinModal {...defaults} unlockPin="111"/>
)).add('more inputs', () => (
	<AuthPinModal {...defaults} unlockPin="111111"/>
)).add('string errorMessage', () => (
	<AuthPinModal {...defaults} errorMessage="Invalid Attempt, please try again"/>
)).add('create pin mode', () => (
	<AuthPinModal {...defaults} createLength={4}/>
));
