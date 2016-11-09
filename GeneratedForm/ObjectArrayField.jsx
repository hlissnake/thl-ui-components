import React, {PropTypes} from 'react';
import FormComponent from './FormComponent';

// Used inside a ReduxArrayField component
const ObjectArrayField = ({
	fields,
	fieldsDefinition,
	arrayComponent:Array,
	arrayRowComponent:ArrayRow,
	arrayFormRowComponent:ArrayFormRow,
	...props
}, {generatedForm}) => {
	let objectArraySettings = generatedForm.objectArray;
	Array = Array || objectArraySettings.arrayComponent;
	ArrayRow = ArrayRow || objectArraySettings.arrayRowComponent;
	ArrayFormRow = ArrayFormRow || objectArraySettings.arrayFormRowComponent;
	return <Array {...props} fields={fields} fieldsMap={(fieldName, index) => <FormComponent
		key={index}
		fields={fields}
		index={index}
		formName={fieldName}
		nested={true}
		fieldsDefinition={fieldsDefinition}
		rowComponent={ArrayFormRow}
		formComponent={ArrayRow}
	/>}/>;
};
ObjectArrayField.isArrayField = true;
ObjectArrayField.propTypes = {
	fields: PropTypes.object.isRequired,
	fieldsDefinition: PropTypes.array.isRequired,
	arrayComponent: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.element
	]),
	arrayRowComponent: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.element
	]),
	arrayFormRowComponent: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.element
	])
};
ObjectArrayField.contextTypes = {
	generatedForm: PropTypes.object
};

export default ObjectArrayField;
