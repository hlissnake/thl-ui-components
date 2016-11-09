import React, {createElement} from 'react';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';

// this prevents multiple triggers of the render function as we allways return the same function
let cachedComponentFunctions = {};

export default function buildField(field, type, CustomFieldComponent, formProps, rowComponent) {
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
				let {input, meta, ...props} = fieldProps;
				if (!CustomFieldComponent) {
					switch (type) {
						case 'select':
							let {optionValue, optionDisplay, ...settings} = (field.settings || {});
							_inputField = <select {...input} {...props} {...settings}>{field.options.map((option, index) => {
								if (isObject(option)) {
									return <option key={index}
												   value={option[optionValue || 'value']}>{option[optionDisplay || 'label']}</option>;
								} else {
									return <option key={index} value={option}>{option}</option>;
								}
							})}</select>;
							break;
						case 'textarea':
							_inputField = <textarea {...input} {...props} {...field.settings}/>;
							break;
						default:
							_inputField = <input {...input} {...props} {...field.settings} type={type || 'text'}/>;
							break;
					}
				} else {
					_inputField =
						<CustomFieldComponent {...field} {...input} {...props} meta={meta}/>;
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
};
