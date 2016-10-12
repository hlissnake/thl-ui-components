import React from 'react';
import Button from '../Stateless/Button';
import {FormattedMessage} from 'react-intl';

export const FormButton = (_props) => {
	let {formProps, meta, validators, rowProps, displayName, settings, ...props} = _props;
	if (settings.type === 'submit' && formProps) {
		props.disabled = !formProps.dirty || formProps.invalid || formProps.submitting;
	}
	if (formProps.submitting) {
		settings = {
			...settings,
			children: <FormattedMessage
				id="components.Forms.submitting"
				defaultMessage="Sending..."
			/>
		};
	}
	return <Button {...props} {...settings}/>;
};
FormButton.nonInteractive = true;

export const DisplayElement = (props) => <div>{props.children}</div>;
DisplayElement.nonInteractive = true;

export function parseInputProps(_props) {
	let {meta, validators, rowProps, displayName, settings, ...props} = _props;
	meta = meta || {};
	props.message = meta.error;
	if (!meta.touched) {
		// props.invalid = false;
		props.message = undefined;
	} else if (meta.error) {
		props['aria-invalid'] = true;
	}
	props.label = props.label || displayName;
	return {...props, ...settings};
}
