import React, {PropTypes, createElement, Component} from 'react';

export default class StaticElement extends Component {
	static contextTypes = {
		_reduxForm: PropTypes.object
	};

	render() {
		let {component, ...props} = this.props;
		return createElement(component, {
			...props, formProps: this.context._reduxForm
		});
	}
}
