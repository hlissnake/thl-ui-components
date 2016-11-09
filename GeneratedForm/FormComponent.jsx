import React, {PropTypes, createElement, Component} from 'react';
import {Field, FieldArray} from 'redux-form';
import isString from 'lodash/isString';
import ObjectArrayField from './ObjectArrayField';
import StaticElement from './StaticElement';
import buildField from './buildField';

export default class FormComponent extends Component {
	static propTypes = {
		formName: PropTypes.string.isRequired,
		fieldsDefinition: PropTypes.array.isRequired,
		nested: PropTypes.bool,
		rowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		formComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
	};
	
	static contextTypes = {
		generatedForm: PropTypes.object
	};

	render() {
		let {generatedForm = {}} = this.context;
		let {
			rowComponent = generatedForm.defaultRowComponent,
			formComponent = generatedForm.defaultFormComponent,
			onSubmit,
			handleSubmit,
			..._formProps
		} = this.props;
		let {fieldsDefinition, ...formProps} = _formProps;
		if (isString(formComponent)) {
			formProps = {
				style: formProps.style,
				className: formProps.className,
				method: formProps.method,
				action: formProps.action
			};
		}
		let fieldPrefix = '';
		if (!_formProps.nested) {
			formProps = {
				...formProps,
				onSubmit: (onSubmit) ? handleSubmit(onSubmit) : undefined,
				name: _formProps.formName
			};
		} else {
			fieldPrefix = `${_formProps.formName}.`;
		}
		return createElement(formComponent, formProps, ..._formProps.fieldsDefinition.map((origField, index) => {
			let {type, required, nonInteractive, Custom, ...field} = origField;
			let ReduxFieldElement = Field;
			let CustomFieldComponent;
			if (isString(type)) {
				CustomFieldComponent = (generatedForm.customFields || {})[type];
				if (!CustomFieldComponent && type === 'objectArray') {
					CustomFieldComponent = ObjectArrayField;
				}
			} else if(Custom) {
				return <Custom key={index} field={origField}/>;
			}
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
			return <ReduxFieldElement key={index} name={`${fieldPrefix}${field.name}`} component={buildField(field, type, CustomFieldComponent, formProps, rowComponent)}/>;
		}))
	};
}
