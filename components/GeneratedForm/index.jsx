import React, { PropTypes, createElement, Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';

export class DefaultFieldRow extends Component {
	static propTypes = {
		label: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.func,
			PropTypes.element
		]).isRequired,
		fieldProps: PropTypes.object.isRequired,
		field: PropTypes.element.isRequired
	};
	
	render() {
		let {label, fieldProps, field, ...props} = this.props;
		return <div {...props}>
			<label>{label}</label>
			{field}
		</div>;
	}
}

export class FormComponent extends Component {
	static propTypes = {
		formName: PropTypes.string.isRequired,
		fields: PropTypes.array.isRequired,
		rowComponent: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
		formComponent: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ])
	};
	
	static contextTypes = {
		customFields: PropTypes.object,
		defaultRowComponent: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
		defaultFormComponent: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ])
	};
	
	render() {
		let {rowComponent = this.context.defaultRowComponent || DefaultFieldRow, formComponent = this.context.defaultFormComponent || 'form', ...props} = this.props;
		return createElement(formComponent, {
			...props,
			name: this.props.formName
		}, ...this.props.fields.map((origField, index) => {
			let {type, ...field} = origField;
			let ReduxFieldElement = Field;
			let _inputField;
			let CustomFieldComponent = (this.context.customFields || {})[type];
			if (CustomFieldComponent && CustomFieldComponent.isArrayField) {
				ReduxFieldElement = FieldArray;
			}
			return <ReduxFieldElement key={index} name={field.name} component={fieldProps => {
				if (!CustomFieldComponent) {
					switch (type) {
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
							_inputField = <input {...fieldProps} {...field.settings} type={type || 'text'}/>;
							break;
					}
				} else {
					_inputField = <CustomFieldComponent {...field.settings} {...field} {...fieldProps}/>;
				}
				return createElement(rowComponent, {
					key: index,
					label: field.label || field.displayName || field.name,
					fieldProps: fieldProps,
					field: _inputField
				});
			}}/>;
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

export default class GeneratedForm extends Component {
	static propTypes = {
		formName: PropTypes.string.isRequired,
		fields: PropTypes.array.isRequired,
		formRedux: PropTypes.object
	};
	
	static contextTypes = {
		buildErrorMessage: PropTypes.func,
		formValidators: PropTypes.object
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
