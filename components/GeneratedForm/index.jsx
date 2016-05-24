import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';

export class DefaultFieldRow extends React.Component {
	static propTypes = {
		label: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.object,
			React.PropTypes.func,
			React.PropTypes.element
		]).isRequired,
		fieldProps: React.PropTypes.object.isRequired,
		field: React.PropTypes.element.isRequired
	};
	
	render() {
		let {label, fieldProps, field, ...props} = this.props;
		return <div {...props}>
			<label>{label}</label>
			{field}
		</div>;
	}
}

export class FormComponent extends React.Component {
	static propTypes = {
		formName: React.PropTypes.string.isRequired,
		fields: React.PropTypes.array.isRequired,
		rowComponent: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.object,
			React.PropTypes.func
		]),
		formComponent: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.object,
			React.PropTypes.func
		])
	};
	
	static contextTypes = {
		customFields: React.PropTypes.object,
		defaultRowComponent: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.object,
			React.PropTypes.func
		]),
		defaultFormComponent: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.object,
			React.PropTypes.func
		])
	};
	
	render() {
		let {rowComponent = this.context.defaultRowComponent || DefaultFieldRow, formComponent = this.context.defaultFormComponent || 'form', ...props} = this.props;
		return React.createElement(formComponent, {
			...props,
			name: this.props.formName
		}, ...this.props.fields.map((field, index) => {
			return <Field name={field.name} component={fieldProps => {
				let _inputField = (this.context.customFields || {})[field.type];
				if (!_inputField) {
					switch (field.type) {
						case 'select':
							let {optionValue, optionDisplay, ...settings} = (field.settings || {});
							_inputField = <select {...fieldProps} {...settings}>{field.options.map((option, index) => {
								if (isObject(option)) {
									return <option key={index} value={option[optionValue || 'value']}>{option[optionDisplay || 'label']}</option>;
								} else {
									return <option key={index} value={option}>{option}</option>;
								}
							})}</select>;
							break;
						case 'textarea':
							_inputField = <textarea {...fieldProps} {...field.settings}/>;
							break;
						default:
							_inputField = <input {...fieldProps} {...field.settings} type={field.type || 'text'}/>;
							break;
					}
				} else {
					_inputField = React.createElement(_inputField, {
						...field.settings,
						...field,
						...fieldProps
					});
				}
				return React.createElement(rowComponent, {
					key: index,
					label: field.label || field.displayName || field.name,
					fieldProps: fieldProps,
					field: _inputField
				});
			}}/>
		}))
	};
}

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
		return (value) => contextValidators[validator.type](validator, name, value);
	}
}

export default class GeneratedForm extends React.Component {
	static propTypes = {
		formName: React.PropTypes.string.isRequired,
		fields: React.PropTypes.array.isRequired,
		formRedux: React.PropTypes.object
	};
	
	static contextTypes = {
		buildErrorMessage: React.PropTypes.func,
		formValidators: React.PropTypes.object
	};
	
	render() {
		let validators = this.props.fields.map((field, index) => {
			let validatorsPipe = [];
			if (field.validator) {
				field.validators = [field.validator];
			}
			if (field.validators) {
				validatorsPipe = field.validators.map((validator) => buildValidator(
					this.context.formValidators || {
						required: (validator, name, value) => (!value) ? buildErrorMessage(validator, name) : undefined
					},
					validator,
					field.displayName || field.name
				));
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
						return error || _validator(values[validator.key]);
					}, undefined);
					return errors;
				}, {});
				return _errors;
			}
		}
		return <ReduxForm {...reduxDetails} {...this.props}/>;
	}
}
