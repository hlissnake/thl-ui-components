import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import BaseSearchSelect from './';

class SearchSelect extends React.Component {
	constructor() {
		super();
		this.state = {
			open: false,
			search: ''
		}
	}
	
	render() {
		return <BaseSearchSelect
			open={this.state.open}
			children={defaultChildren}
			onDismiss={() => this.setState({open: false})}
			onOpen={() => this.setState({open: true})}
			onChange={action("onChange")}
			searchValue={this.state.search}
			onSearchChange={event => this.setState({search: event.target.value})}
			searchElement={<span>Searching</span>}
			{...this.props}
		/>;
	}
}

const defaultChildren = (item, onClick, isSelected) => {
	if (onClick) {
		return <div onClick={onClick}>{item ? item : isSelected ? 'Please Select' : 'Add New'}</div>;
	} else {
		return <div>No Results available</div>;
	}
};

storiesOf('SearchSelect', module)
.add('basic', () => (
	<SearchSelect/>
)).add('searching', () => (
	<SearchSelect searching={true}/>
)).add('with max values', () => (
	<SearchSelect searchResults={['first','second']} maxResults={2}/>
)).add('under max values', () => (
	<SearchSelect searchResults={['first','second']}/>
)).add('show onNew', () => (
	<SearchSelect onNew={action("onNew")} searchResults={['first','second']}/>
)).add('override just some styles', () => (
	<SearchSelect styles={{dropdown: {open: {boxShadow: '0px 0px 8px 0px rgba(0,255,0,0.75)'}}}}/>
));
