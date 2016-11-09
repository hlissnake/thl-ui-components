import React, {PropTypes, createElement, Component} from 'react';

export default class DefaultFieldRow extends Component {
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
