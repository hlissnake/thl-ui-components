import React from 'react';
import {createStore, combineReducers} from 'redux'
import {reducer as formReducer, Field} from 'redux-form'
import {Provider, connect} from 'react-redux';
import {storiesOf, action} from '@kadira/storybook';
import GeneratedForm, {DefaultFieldRow, FormComponent} from './';
import {Input} from 'rebass';

class GenerateContext extends React.Component {
	getChildContext() {
		return {customFields: this.props.customFields};
	}
	
	static childContextTypes = {
		customFields: React.PropTypes.object
	};
	
	render() {
		return <div {...this.props}/>
	}
}

class CustomCheckboxInput extends React.Component {
	static isArrayField = true;
	render() {
		return <div>{this.props.map((fieldName, index) => <div>
			<Field
				component="input"
				type="checkbox"
				name={`${fieldName}.selected`}
			/> <Field
				name={fieldName}
				component={fieldProps => <span>{fieldProps.value.name}</span>}/>
		</div>)}</div>;
	}
}

class DebugForm extends React.Component {
	render() {
		return <block>{JSON.stringify(this.props)}</block>;
	};
}
let ConnectedDebugForm = connect(state => state)(DebugForm);

storiesOf('GeneratedForm', module)
.add('Default Row Component', () => (
	<DefaultFieldRow label="Test Label" field={<input/>} fieldProps={{}}/>
))
.addDecorator(story => <Provider store={createStore(combineReducers({form: formReducer}))}>
	<div>{story()}<ConnectedDebugForm/></div>
</Provider>)
.add('Form Component', () => (
	<GeneratedForm formName="testform" fields={[
		{
			name: 'name'
		},
		{
			name: 'age',
			displayName: 'Age',
			type: 'number',
			settings: {
				placeholder: 'Your Age'
			}
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
))
.add('Form Component With Custom Row Renderer', () => (
	<GeneratedForm formName="testform" fields={[
		{
			name: 'test1'
		},
		{
			name: 'test2',
			type: 'text'
		}
	]} rowComponent={_props => {
		let {label, fieldProps, field, ...props} = _props;
		
		return <div {...props}>
			<label>{label}</label>
			{field}
			<span>Invalid: {(fieldProps.invalid) ? 'true' : 'false'}, touched: {(fieldProps.touched) ? 'true' : 'false'}</span>
		</div>
	}}/>
))
.add('Form Component With Custom Renderer on Context', () => (
	<GenerateContext customFields={{rebassInput: Input}}><GeneratedForm formName="testform" fields={[
		{
			name: 'test2',
			label: 'test rebass',
			type: 'rebassInput'
		}
	]}/></GenerateContext>
))
.add('Array type custom component', () => (
	<GenerateContext customFields={{customCheckboxInput: CustomCheckboxInput}}><GeneratedForm formName="testform" fields={[
		{
			name: 'test2',
			label: 'test checkboxes',
			type: 'customCheckboxInput'
		}
	]} formRedux={{
		initialValues: {
			'test2': [
				{selected: false, name: 'Option 1'},
				{selected: false, name: 'Option 2'},
				{selected: false, name: 'Option 3'},
				{selected: false, name: 'Option 4'}
			]
		}
	}}/></GenerateContext>
))
.add('Form Component With Validation', () => (
	<GeneratedForm formName='testValidation' fields={[
    {
        name: 'nameField',
        validators: [
            'required',
            (value) => {
                if (value.length < 12) return 'NameField must be 12 characters or longer';
            }
        ]
    }
	]} rowComponent={_props => {
		let {label, fieldProps, field, ...props} = _props;
		return <div {...props}>
			<label>{label}</label>
			{field}
			<span>Invalid: {(fieldProps.invalid) ? 'true' : 'false'}, touched: {(fieldProps.touched) ? 'true' : 'false'}, {fieldProps.error}</span>
		</div>
	}}/>
));
