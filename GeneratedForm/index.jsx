import React, {PropTypes, createElement, Component} from 'react';
import {reduxForm} from 'redux-form';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';

import DefaultFieldRow from './DefaultFieldRow'
import FormComponent from './FormComponent';

const ReduxForm = reduxForm()(FormComponent);

function buildErrorMessage(validator, name) {
	if (isFunction(validator.message)) {
		return validator.message(validator, name);
	} else if (isString(validator.message)) {
		return validator.message;
	} else {
		return `${name} is ${validator.verb || validator.type}`;
	}
}

function buildValidator(contextValidators, validator, name) {
	if (isString(validator)) {
		validator = {
			type: validator
		};
	}
	if (isFunction(validator)) {
		return validator;
	} else if (isObject(validator) && contextValidators[validator.type]) {
		return (value, values) => contextValidators[validator.type](validator, name, value);
	}
}

function _requiredValidator(validator, name, value) {
	return (!value) ? buildErrorMessage(validator, name) : undefined;
}

function _emailValidator(validator, name, value) {
	return (!value || !/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/ig.test(value)) ? buildErrorMessage(validator, name) : undefined;
}

export default class GeneratedForm extends Component {
	static propTypes = {
		formName: PropTypes.string.isRequired,
		fieldsDefinition: PropTypes.array.isRequired,
		formRedux: PropTypes.object,
		onSubmit: PropTypes.func
	};

	static contextTypes = {
		generatedForm: PropTypes.object
	};
	
	// THe following creates the defaults for the generatedForm context
	static childContextTypes = {
		generatedForm: PropTypes.object
	};
	
	getChildContext() {
		let _generatedForm = this.context.generatedForm || {};
		let generatedForm = {
			defaultFormComponent: 'form',
			defaultRowComponent: DefaultFieldRow,
			objectArray: {
				arrayComponent: (({fields, fieldsMap, displayName, meta, ...props}) => <div {...props}>
					{fields.map(fieldsMap)}
					<button type="button" onClick={() => fields.push({})}>Add</button>
				</div>),
				arrayRowComponent: (({index, formName, children, fields}) => <div>
					{children}
					<button type="button" onClick={() => fields.remove(index)}>remove</button>
				</div>),
				arrayFormRowComponent: _generatedForm.defaultRowComponent || DefaultFieldRow,
				..._generatedForm.objectArray
			},
			..._generatedForm
		};
		return {generatedForm};
	}
	
	shouldComponentUpdate(nextProps) {
		return this.props.formName !== nextProps.formName || this.props.fieldsDefinition !== nextProps.fieldsDefinition || this.props.formRedux !== nextProps.formRedux;
	}

	render() {
		let validators = this.props.fieldsDefinition.map((field, index) => {
			let validatorsPipe = [];
			if (field.validator) {
				field.validators = [field.validator];
			}
			let contextValidators = (this.context.generatedForm || {}).formValidators || {
					required: _requiredValidator,
					email: _emailValidator
				};
			if (field.validators) {
				validatorsPipe = field.validators.map((validator) => buildValidator(
					contextValidators,
					validator,
					field.displayName || field.name
				));
			}
			if (field.settings && field.settings.type === 'email') {
				validatorsPipe.unshift(buildValidator(contextValidators, {
					type: 'email',
					verb: 'not a valid email'
				}, field.displayName || field.name));
			}
			if (field.required) {
				validatorsPipe.unshift(buildValidator(contextValidators, 'required', field.displayName || field.name));
			}
			return {
				key: field.name,
				pipe: validatorsPipe
			};
		});
		let reduxDetails = {
			...(this.props.formRedux || {}),
			form: this.props.formName
		};
		if (validators.reduce((count, details) => count + details.pipe.length, 0) > 0) {
			reduxDetails.validate = values => {
				let _errors = validators.reduce((errors, validator) => {
					errors[validator.key] = validator.pipe.reduce((error, _validator) => {
						return error || _validator(values[validator.key], values);
					}, undefined);
					return errors;
				}, {});
				return _errors;
			}
		}
		return <ReduxForm {...reduxDetails} {...this.props}/>;
	}
}
