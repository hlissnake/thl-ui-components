import React, {Component, PropTypes} from 'react';
import Overlay from 'rebass/dist/Overlay';
import Base from 'rebass/dist/Base';
import Heading from 'rebass/dist/Heading';
import Text from 'rebass/dist/Text';
import NavItem from 'rebass/dist/NavItem';
import rebassConfig from 'rebass/dist/config';
import _isFunction from 'lodash/isFunction';
import color from 'color';

export default class AuthPinModal extends Component {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		unlockPin: PropTypes.string.isRequired,
		onPinAuth: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		onFailure: PropTypes.func.isRequired,
		cancelText: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		errorMessage: PropTypes.oneOf([PropTypes.string,PropTypes.func]).isRequired,
		maxTries: PropTypes.number
	};
	
	static contextTypes = {
		rebass: PropTypes.object
	};
	
	constructor(){
		super();
		this.state = {
			selectedIndex: 0,
			incorrectTries: 0,
			correctPin: false,
			pinInput: [],
			targetPin: []
		};
		this.keypressHandler = this.keypressHandler.bind(this);
		this.showModal = this.showModal.bind(this);
	}
	
	componentWillMount() {
		if (this.props.open) {
			this.showModal(this.props);
		}
	}
	
	componentWillUnmount() {
		this.removeEvent();
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.open !== this.props.open) {
			if (nextProps.open) {
				this.showModal(nextProps);
			} else {
				this.removeEvent();
			}
		}
	}
	
	render(){
		const { scale, colors, borderColor } = { ...rebassConfig, ...this.context.rebass }
		const inputStyle = {
			width: 30,
			height: 30,
			borderWidth: '1px',
			borderStyle: 'solid',
			verticalAlign: 'middle',
			textAlign: 'center',
			lineHeight: '30px',
			fontSize: '95px',
			textIndent: '4px',
			display: 'flex',
			margin: '0px 8px',
			boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.2) inset',
			cursor: 'pointer'
		};
		const selectedInputStyle = {
			...inputStyle,
			borderColor: colors.primary,
			backgroundColor: color(colors.primary).alpha(0.3).lighten(0.3).rgbaString(),
			boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.4) inset'
		};
		const filledInputStyle = {
			...inputStyle,
			borderColor: colors.primary,
			backgroundColor: color(colors.primary).alpha(0.1).lighten(0.3).rgbaString(),
			boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.4) inset'
		};
		const emptyInputStyle = {
			...inputStyle,
			borderColor
		};
		const errorInputStyle = {
			...inputStyle,
			borderColor: colors.error,
			backgroundColor: color(colors.error).alpha(0.1).lighten(0.3).rgbaString(),
			boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.4) inset'
		};
		return <Overlay open={this.props.open} box style={{minWidth: 0, padding: 12, textAlign: 'center', maxWidth: Math.max(210, 46 * this.state.targetPin.length + 24), zIndex: 9999}}>
			<Heading level={4} style={{marginBottom: 8}}>{this.props.message}</Heading>
			<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', marginBottom: 8}}>
				{this.state.targetPin.map((value, index) => {
					let className = 'PinInput ', baseStyle;
					if (this.props.maxTries && this.props.maxTries > 0 && this.state.incorrectTries >= this.props.maxTries) {
						className += 'ErrorPinInput';
						baseStyle = errorInputStyle;
					} else if (index === this.state.selectedIndex) {
						className += 'SelectedPinInput';
						baseStyle = selectedInputStyle;
					} else if (this.state.pinInput[index]) {
						className += 'FilledPinInput';
						baseStyle = filledInputStyle;
					} else {
						className += 'EmptyPinInput';
						baseStyle = emptyInputStyle;
					}
					return <Base
						key={`inputHolder${index}`}
						rounded
						className={className}
						baseStyle={baseStyle}
						children={this.state.pinInput[index] ? <span>&#183;</span> : undefined}
						onClick={() => {
							let newIndex = Math.min(this.state.selectedIndex, index);
							this.setState({
								pinInput: this.state.pinInput.slice(0, newIndex),
								selectedIndex: newIndex
							});
						}}
					/>;
				})}
			</div>
			<Text theme="error" bold>{this.displayErrorMessage()}</Text>
			<NavItem onClick={this.props.onCancel} theme="primary" style={{float: 'right', marginBottom: -8, marginRight: -8}}>{this.props.cancelText}</NavItem>
		</Overlay>;
	}
	
	keypressHandler(event) {
		if (/^[a-z0-9]$/ig.test(event.key) && this.state.selectedIndex >= 0 && this.state.selectedIndex < this.state.targetPin.length) {
			let pinInput = [...this.state.pinInput];
			pinInput[this.state.selectedIndex] = event.key;
			if (pinInput.length === this.state.targetPin.length) {
				let correctPin = this.state.targetPin.reduce((correct, element, index) => correct && element === pinInput[index], true);
				let incorrectTries = (correctPin || !this.props.maxTries || this.props.maxTries <= 0) ? 0 : (this.state.incorrectTries + 1);
				this.setState({
					pinInput: [],
					selectedIndex: 0,
					incorrectTries,
					correctPin
				});
				if (correctPin) {
					this.props.onPinAuth();
				} else if (this.props.maxTries && this.props.maxTries > 0 && incorrectTries >= this.props.maxTries) {
					this.props.onFailure();
					this.removeEvent();
				} 
			} else {
				this.setState({pinInput, selectedIndex: this.state.selectedIndex + 1});
			}
		} else if ((event.keyCode === 8 || event.keyCode === 46) && this.state.selectedIndex > 0) {
			this.setState({
				pinInput: this.state.pinInput.slice(0, this.state.selectedIndex - 1),
				selectedIndex: this.state.selectedIndex - 1
			});
		}
	}
	
	displayErrorMessage() {
		if (this.state.incorrectTries > 0) {
			if (_isFunction(this.props.errorMessage)) {
				return this.props.errorMessage(this.state.incorrectTries);
			} else {
				return this.props.errorMessage;
			}
		}
	}
	
	showModal(props) {
		document.body.addEventListener('keydown', this.keypressHandler);
		this.setState({
			selectedIndex: 0,
			incorrectTries: 0,
			correctPin: false,
			pinInput: [],
			targetPin: props.unlockPin.split('')
		});
	}
	
	removeEvent() {
		document.body.removeEventListener('keydown', this.keypressHandler);
	}
}
