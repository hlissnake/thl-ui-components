---
title: GeneratedForm Component
layout: default
---

# GeneratedForm Component Readme

## Getting Started

Basic usage of the GeneratedForm Component is fairly simple, two parameters are required; 'formName' and 'fieldsDefinition'. These will be used to build the redux-form and all inputs.
Note that all unspecified props passed to the GeneratedForm Component are placed on the generated <form> tag, you can use this to do Submit Validation and similar.

For additional examples see the attached stories (or run `npm run storybook`).

See the following example ([Live Demo]({{ '/storybook/?selectedKind=GeneratedForm&selectedStory=Form%20Component' | prepend: site.baseurl }})):

```jsx
import GeneratedForm from 'GeneratedForm';

...

<GeneratedForm formName="testForm" fieldsDefinition={[
    {
        name: 'name'
    },
    {
        name: 'age',
        type: 'number'
    },
    {
        name: 'gender',
        label: <b>Gender</b>,
        type: 'select',
        options: [
            'male',
            'female'
        ]
    }
]}/>
```

## API

### GeneratedForm

This component converts the passed in parameters to be a useful form.

__context__

The following values are used from the context if available.

| Property Name | Type | Description |
| --- | --- | --- |
| __customFields__ | _object_ | This object has key-value pairs. If the key matches a field type then the value is used in the `React.createElement(<value>...` to create the input. The following are passed as props; key-values from field.settings, the key-values from field, all redux-form values and if a field is set to nonInteractive then the `formProps` property containing the redux-form props is also passed. Additionally if a Class or Object has the `isArrayField` value set to true then the component will be passed to a FieldArray instead of a Field component. |
| __buildErrorMessage__ | _function_ | This function, if provided, generates the default error message based on the field validator. The default function is as after below. |
| __formValidators__ | _object_ | An object of key/value pairs which defines validators to be used. __NOTE__ These default validators have 3 parameters as opposed to fields.validators. Default is: `{required: (validator, name, value) => (!value) ? buildErrorMessage(validator, name) : undefined}` |
| __defaultRowComponent__ | _object / React Class / html_ | default value for __rowComponent__ |
| __defaultFormComponent__ | _object / React Class / html_ | default value for __formComponent__ |

```jsx
function buildErrorMessage(validator, name) {
    if (isFunction(validator.message)) {
        return validator.message(validator, name);
    } else if (isString(validator.message)) {
        return validator.message;
    } else {
        return `${name} is ${validator.verb || validator.type}`;
    }
}
```

__props__

| Property Name | Type | Description |
| --- | --- | --- |
| __fieldName__ | _string_ | The name of the form field. |
| __fieldsDefinition__ | _array_ | Array of form field definitions, see fieldsDefinition below for details. |
| __rowComponent__ | _React Class / html element name string / React Element / Wrapped React Element Function_ | This is passed to this is used as the formatter/wrapper for each element, defaults to DefaultFieldRow (see below for details) |
| __formComponent__ | _React Class / html element name string / React Element / Wrapped React Element Function_ | This is used to wrap all the rowComponents, is passed name (as formName) and all other props, defaults to 'form'. |
| __formRedux__ | _object_ | Additional formRedux values, this is used to pass extra custom parameters to the formRedux handler (See **important** under config here: http://redux-form.com/6.0.0-alpha.15/docs/api/ReduxForm.md/) |
| __onSubmit__ | _function_ | Function is used in the onSubmit handler of the form, additionally it is wrapped in the handleSubmit function of redux-form. If not defined the onSubmit of generated form is simply the handleSubmit function. |

#### GeneratedForm > fieldsDefinition

Field definitions are the data needed to display the component and validate the data.

__Parameters__

| Property Name | Type | Description |
| --- | --- | --- |
| __name: (required)__ | _string_ | This is the name used in redux-form. Essentially this is the field identifier. |
| __type: (required)__ | _string_ | This is the key that determines what input is displayed, currently supported (in order of precedence) Any key on `context.customFields`, 'select', 'textarea', any other value will be passed to an input field as the type parameter (defaults to 'text'). |
| __displayName__ | _string_ | This is the name that will be displayed to the user - defaults to name. |
| __required__ | _any_ | If set this value is passed to the input as required, can also be set in __settings__ |
| __label__ | _string / React element_ | This is used as the label to display in the default display components. If not provided will use displayName. |
| __settings__ | _object_ | This is passed as props to the input, for example `settings: {placeholder: 'Placeholder'}` will put the attribute `placeholder="Placeholder"` on the input. |
| __nonInteractive__ | _boolean_ | If true the field will not be wrapped in the reduxForm `Field` or `FieldArray` component but will be called as a normal element, useful for submit buttons or external links. This can also be set on a custom component to set it globally. |
| __rowProps__ | _object_ | This is passed as props to the rowComponent, for example `rowProps: {style: styleObject}` will set the style property of the rowComponent to be the styleObject. |
| __validators__ | _array_ | An array of validators, see 'validator' property for individual settings. |
| __validator__ | _object / string / function_ | If string the validator is converted to `{type: validator}` object. If an object it's type key is checked against inbuilt validators and that validator is called. If a function then the function is used as the validation. These are used in the `redux.validators`, see Validation for more details. |
| __Custom__ | _React class / stateless function_ | Used to override the entire render of the form field, note you will have to manually include the Field/FieldArray component if needed - this also overrides the type param. |

__Type='select' Parameters__

| Property Name | Type | Description |
| --- | --- | --- |
| __options__ | _array_ | Either an array of strings/numbers/booleans or objects. |
| __settings.optionDisplay__ | _string_ | If objects are used in `options` parameter then this is the object key for the text of the `<option>` tag. Defaults to 'label'. |
| __settings.optionValue__ | _string_ | If objects are used in `options` parameter then this is the object key for the value of the `<option>` tag. Defaults to 'value'. |

#### GeneratedForm > Validation

The fieldsDefinition passed into GeneratedForm use the validators or validation params to build a validation pipeline. If you've used redux-forms before you would be familiar with validation that looks like this:

```jsx
validator: (values) => {
    let errors = {};
    if (!values.nameField) {
        errors.nameField = 'Name Field is Required';
    } else if(values.nameField.length < 12) {
        errors.nameField = 'Name Field must be 12 characters or longer';
    }
    return errors;
};
```

If we were to convert this to a GeneratedForm component field set we would do the following, note that if the first one is failed the subsequent checks will not run:

```jsx
<GeneratedForm formName='testValidation' fieldsDefinition={[
    {
        name: 'nameField',
        validators: [
            'required',
            (value, values) => { // value is the 'nameField' value, values is all values of the form
                if (value.length < 12) return 'NameField must be 12 characters or longer';
            }
        ]
    }
]}/>
```

You could also override this by manually passing in the validate parameter in the `formRedux` parameter.
Note that passing a string will attempt to get the corresponding function off the 'context.formValidators' object, by default the only validator included is the required validator.

#### Generated Form > rowComponent

The Component passed to rowComponent is build and passed the following properties:

__props__

| Property Name | Type | Description |
| --- | --- | --- |
| __label__ | _string / object / function / element_ | A react display variable, used to display the name/label of the component. |
| __fieldProps__ | _object_ | These is the object with all the redux field properties on it, these are `input`, `meta` and all props passed to the component. |
| __formProps__ | _object_ | These is the object with all the redux form component properties on it. |
| __field__ | _element_ | The built input element. |

The default value for this is as follows:

```jsx
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
```

### Generated Form > customComponent

If you provide a custom stateless function as the custom value or provide a custom form type the following params are passed on the props in addition to the standard input values.
These should be stripped out as react v15 will give you errors. Fields are: `meta` (from Redux-Form), displayName, settings. The last two are from your fields definition.
