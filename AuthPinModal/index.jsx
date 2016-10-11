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
		onPinAuth: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		onFailure: PropTypes.func.isRequired,
		cancelText: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		errorMessage: PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
		maxTries: PropTypes.oneOfType([PropTypes.bool,PropTypes.number]),
		unlockPin: PropTypes.string,
		createLength: PropTypes.number,
		autoFocus: PropTypes.bool,
		forceError: PropTypes.bool
	};
	
	static contextTypes = {
		rebass: PropTypes.object
	};
	
	constructor(){
		super();
		this.state = {
			selectedIndex: -1,
			incorrectTries: 0,
			correctPin: false,
			pinInput: [],
			targetPin: []
		};
		this.keypressHandler = this.keypressHandler.bind(this);
		this.showModal = this.showModal.bind(this);
		this.selectInput = this.selectInput.bind(this);
	}
	
	componentDidMount() {
		if (this.props.open) {
			this.showModal(this.props);
		}
	}
	
	componentWillUnmount() {
		this.removeEvent();
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.open !== this.props.open || nextProps.unlockPin !== this.props.unlockPin) {
			if (nextProps.open) {
				this.showModal(nextProps);
			} else {
				this.removeEvent();
			}
		}
	}
	
	render(){
		const { scale, colors, borderColor } = { ...rebassConfig, ...this.context.rebass };
		const dotStyle = {
			height: 12,
			width: 12,
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			borderRadius: 6,
			backgroundColor: 'currentColor'
		};
		const inputStyle = {
			position: 'relative',
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
		const selectedErrorInputStyle = {
			...inputStyle,
			borderColor: colors.error,
			backgroundColor: color(colors.error).alpha(0.3).lighten(0.3).rgbaString(),
			boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.4) inset'
		};
		return <Overlay open={this.props.open} box style={{minWidth: 0, padding: 12, textAlign: 'center', maxWidth: Math.max(210, 46 * this.state.targetPin.length + 24), zIndex: 9999}}>
			<Heading level={4} style={{marginBottom: 8}}>{this.props.message}</Heading>
			<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', marginBottom: 8}}>
				{this.state.targetPin.map((value, index) => {
					let className = 'PinInput ', baseStyle;
					if (this.state.incorrectTries > 0 && this.state.selectedIndex === 0) {
						className += 'ErrorPinInput';
						if (index === 0) {
							baseStyle = selectedErrorInputStyle;
						} else {
							baseStyle = errorInputStyle;
						}
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
						children={this.state.pinInput[index] ? <span style={dotStyle}/> : undefined}
						onClick={() => {
							let newIndex = Math.min(Math.max(this.state.selectedIndex, 0), index);
							this.selectInput(newIndex, {
								pinInput: this.state.pinInput.slice(0, newIndex)
							});
						}}
					/>;
				})}
			</div>
			<Text theme="error" bold>{this.displayErrorMessage()}</Text>
			<NavItem onClick={this.props.onCancel} theme="primary" style={{float: 'right', marginBottom: -8, marginRight: -8}}>{this.props.cancelText}</NavItem>
			<input type="tel" style={{position: 'absolute', top: 0, left: 0, height: 1, width: 1, opacity: 0, zIndex: -1, color: 'transparent'}} ref={input => this.hiddenInput = input} onKeyPress={this.keypressHandler}/>
		</Overlay>;
	}
	
	selectInput(index, state) {
		if (index >= 0) setTimeout(() => this.hiddenInput.focus());
		this.setState({...state, selectedIndex: index});
	}
	
	keypressHandler(event) {
		if (/^[0-9]$/ig.test(event.key) && this.state.selectedIndex >= 0 && this.state.selectedIndex < this.state.targetPin.length) {
			let pinInput = [...this.state.pinInput];
			pinInput[this.state.selectedIndex] = event.key;
			if (!isNaN(this.props.createLength) && this.props.createLength > 0 && pinInput.length === this.props.createLength) {
				this.props.onPinAuth(pinInput.join(''));
				this.selectInput(0, {
					pinInput: [],
					incorrectTries: 0,
					correctPin: true
				});
			} else if (pinInput.length === this.state.targetPin.length) {
				let correctPin = this.state.targetPin.reduce((correct, element, index) => correct && element === pinInput[index], true);
				let incorrectTries = (correctPin || !this.props.maxTries || this.props.maxTries <= 0) ? 0 : (this.state.incorrectTries + 1);
				this.selectInput(0, {
					pinInput: [],
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
				this.selectInput(this.state.selectedIndex + 1, {pinInput});
			}
		} else if ((event.keyCode === 8 || event.keyCode === 46) && this.state.selectedIndex > 0) {
			this.selectInput(this.state.selectedIndex - 1, {
				pinInput: this.state.pinInput.slice(0, this.state.selectedIndex - 1)
			});
		}
	}
	
	displayErrorMessage() {
		if (this.state.incorrectTries > 0 || this.state.forceError) {
			if (_isFunction(this.props.errorMessage)) {
				return this.props.errorMessage(this.state.incorrectTries);
			} else {
				return this.props.errorMessage;
			}
		}
	}
	
	showModal(props) {
		let _unlockPin = props.unlockPin;
		if (props.createLength) {
			_unlockPin = '';
			for (var l = 0; l < props.createLength; l++) _unlockPin += '0';
		}
		this.selectInput(props.autoFocus ? 0 : -1, {
			incorrectTries: 0,
			forceError: props.forceError,
			correctPin: false,
			pinInput: [],
			targetPin: _unlockPin.split('')
		});
	}
	
	removeEvent() {
		this.hiddenInput.blur();
	}
}
