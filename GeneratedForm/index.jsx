import React, {PropTypes, createElement, Component} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';

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

class StaticElement extends Component {
	static contextTypes = {
		_reduxForm: PropTypes.object
	}

	render() {
		let {component, ...props} = this.props;
		return createElement(component, {
			...props, formProps: this.context._reduxForm
		});
	}
}

// this prevents multiple triggers of the render function as we allways return the same function
let cachedComponentFunctions = {};

const buildFieldComponent = (field, type, CustomFieldComponent, formProps, rowComponent) => {
	if (cachedComponentFunctions[`${formProps.formName}-${field.name}`] &&
		isEqual(cachedComponentFunctions[`${formProps.formName}-${field.name}`].field, field) &&
		cachedComponentFunctions[`${formProps.formName}-${field.name}`].type === type &&
		cachedComponentFunctions[`${formProps.formName}-${field.name}`].CustomFieldComponent === CustomFieldComponent &&
		cachedComponentFunctions[`${formProps.formName}-${field.name}`].rowComponent === rowComponent
	) {
		return cachedComponentFunctions[`${formProps.formName}-${field.name}`].component;
	} else {
		return (cachedComponentFunctions[`${formProps.formName}-${field.name}`] = {
			field,
			type,
			CustomFieldComponent,
			rowComponent,
			component: fieldProps => {
				let _inputField;
				if (!CustomFieldComponent) {
					switch (type) {
						case 'select':
							let {optionValue, optionDisplay, ...settings} = (field.settings || {});
							_inputField = <select {...fieldProps} {...settings}>{field.options.map((option, index) => {
								if (isObject(option)) {
									return <option key={index}
												   value={option[optionValue || 'value']}>{option[optionDisplay || 'label']}</option>;
								} else {
									return <option key={index} value={option}>{option}</option>;
								}
							})}</select>;
							break;
						case 'textarea':
							_inputField = <textarea {...fieldProps.input} {...field.settings}/>;
							break;
						default:
							_inputField = <input {...fieldProps.input} {...field.settings} type={type || 'text'}/>;
							break;
					}
				} else {
					_inputField =
						<CustomFieldComponent {...field.settings} {...field} {...fieldProps}/>;
				}
				return createElement(rowComponent, {
					...(field.rowProps || {}),
					label: field.label || field.displayName || field.name,
					fieldProps,
					field: _inputField
				});
			}
		}).component;
	}
}

export class FormComponent extends Component {
	static propTypes = {
		formName: PropTypes.string.isRequired,
		fieldsDefinition: PropTypes.array.isRequired,
		rowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		formComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
	};

	static contextTypes = {
		customFields: PropTypes.object,
		defaultRowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		defaultFormComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
	};

	render() {
		let {
			rowComponent = this.context.defaultRowComponent || DefaultFieldRow,
			formComponent = this.context.defaultFormComponent || 'form',
			onSubmit,
			handleSubmit,
			..._formProps
		} = this.props;
		let {fieldsDefinition, ...formProps} = _formProps;
		if (isString(formComponent)) {
			formProps = {
				style: formProps.style,
				className: formProps.className
			};
		}
		formProps = {
			...formProps,
			onSubmit: (onSubmit) ? handleSubmit(onSubmit) : undefined,
			name: _formProps.formName
		};
		return createElement(formComponent, formProps, ..._formProps.fieldsDefinition.map((origField, index) => {
			let {type, required, nonInteractive, ...field} = origField;
			let ReduxFieldElement = Field;
			let CustomFieldComponent = (this.context.customFields || {})[type];
			if (required) {
				field.settings = {
					...(field.settings || {}),
					required
				};
			}
			if (CustomFieldComponent && CustomFieldComponent.isArrayField) {
				ReduxFieldElement = FieldArray;
			} else if (nonInteractive || (CustomFieldComponent && CustomFieldComponent.nonInteractive)) {
				ReduxFieldElement = StaticElement;
			}
			return <ReduxFieldElement key={index} name={field.name} component={buildFieldComponent(field, type, CustomFieldComponent, formProps, rowComponent)}/>;
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
		buildErrorMessage: PropTypes.func,
		formValidators: PropTypes.object
	};

	shouldComponentUpdate(nextProps) {
		return this.props.formName !== nextProps.formName || this.props.fieldsDefinition !== nextProps.fieldsDefinition || this.props.formRedux !== nextProps.formRedux;
	}

	render() {
		let validators = this.props.fieldsDefinition.map((field, index) => {
			let validatorsPipe = [];
			if (field.validator) {
				field.validators = [field.validator];
			}
			let contextValidators = this.context.formValidators || {
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
