import React from 'react';
import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
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
	<GeneratedForm formName="testform" fieldsDefinition={[
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
	<GeneratedForm formName="testform" fieldsDefinition={[
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
	<GenerateContext customFields={{rebassInput: Input}}><GeneratedForm formName="testform" fieldsDefinition={[
		{
			name: 'test2',
			label: 'test rebass',
			type: 'rebassInput'
		}
	]}/></GenerateContext>
))
.add('Form Component With Validation', () => (
	<GeneratedForm formName='testValidation' fieldsDefinition={[
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
