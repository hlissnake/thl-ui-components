import React, {PropTypes} from 'react';
import Radium from 'radium';
import Base from 'rebass/dist/Base';
import rebassConfig from 'rebass/dist/config';
import _isString from 'lodash/isString';

class ProgressBar extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		theme: PropTypes.string,
		percent: PropTypes.number.isRequired,
		onTop: PropTypes.bool,
		absolute: PropTypes.bool,
		autoIncrement: PropTypes.bool,
		intervalTime: PropTypes.number,
		spinner: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object])
	};
	
	static defaultProps = {
		percent: -1,
		onTop: false,
		absolute: false,
		autoIncrement: false,
		intervalTime: 200,
		spinner: 'left',
		theme: 'primary'
	};
	
	static contextTypes = {
		rebass: PropTypes.object
	};
	
	constructor(props) {
		super(props);
		this.state = {
			percent: props.percent * 100
		};
	}
	
	componentDidMount = () => {
		this.handleProps(this.props);
	};
	
	componentWillReceiveProps = (nextProps) => {
		if (this.interval) {
			clearInterval(this.interval);
		}
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.handleProps(nextProps);
	};
	
	componentWillUnmount = () => {
		if (this.interval) {
			clearInterval(this.interval);
		}
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	};
	
	increment = () => {
		let {percent} = this.state;
		percent = percent + (Math.random() + 1 - Math.random());
		percent = percent < 99 ? percent : 99;
		this.setState({
			percent: percent
		});
	};
	
	handleProps = (props) => {
		let percent = props.percent * 100;
		if (props.autoIncrement && percent >= 0 && percent < 99) {
			this.interval = setInterval(this.increment, props.intervalTime);
		}
		if (percent >= 100) {
			this.setState({
				percent: 99.9
			}, () => {
				this.timeout = setTimeout(() => {
					this.setState({
						percent: -1
					});
				}, 400);
			});
		} else {
			this.setState({
				percent: percent
			});
		}
	};
	
	render() {
		const { colors, ProgressBar_Spinner_Icon } = { ...rebassConfig, ...this.context.rebass }
		let {onTop, spinner, className, theme, absolute, style = {}} = this.props;
		className = 'ProgressBar' + (className ? ' ' + className : '');
		let {percent} = this.state;
		let spinnerIconStyle = {
			...classes.spinnerIcon,
			...(ProgressBar_Spinner_Icon || {}),
			borderTopColor: colors[theme],
			borderLeftColor: colors[theme]
		};
		let percentStyle = {
			...classes.percent,
			background: colors[theme],
			boxShadow: `0 0 10px ${colors[theme]}, 0 0 5px ${colors[theme]}`
		};
		let mainStyle = {
			...classes.main,
			...(absolute ? classes.absolute : {}),
			...(onTop ? classes.onTop : {}),
			...((percent < 0 || percent >= 100) ? classes.hide : {}),
			...style
		};
		let barStyle = {
			...percentStyle,
			width: (percent < 0 ? 0 : percent) + '%'
		};
		let spinnerClass;
		if (_isString(spinner)) {
			spinnerClass = classes[`spinner-${spinner}`];
		} else {
			spinnerClass = spinner;
		}
		let spinnerStyles = {
			...classes.spinner,
			...(absolute ? classes.absolute : {}),
			...spinnerClass
		};
		return (
			<Base className={className} baseStyle={mainStyle}>
				<div style={{overflow: 'hidden', height: 3}}>
					<Base className="ProgressBar_Bar" baseStyle={barStyle}/>
				</div>
				{
					spinner ?
						<Base className="ProgressBar_Spinner" baseStyle={spinnerStyles}>
							<div className="ProgressBar_Spinner_Icon" style={spinnerIconStyle}/>
						</Base>
						: null
				}
			</Base>
		);
	}
}

const spinnerKeyframes = Radium.keyframes({
	'0%': {
		transform: 'rotate(0deg)'
	},
	'100%': {
		transform: 'rotate(360deg)'
	}
});
const classes = {
	main: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		visibility: 'visible',
		opacity: 1,
		transition: 'all 400ms',
		zIndex: 9999
	},
	onTop: {
		height: '100%'
	},
	absolute: {
		position: 'absolute'
	},
	hide: {
		opacity: 0,
		visibility: 'hidden',
		zIndex: -10
	},
	percent: {
		height: 2,
		transition: 'all 200ms ease'
	},
	spinner: {
		display: 'block',
		position: 'fixed',
		top: 15
	},
	'spinner-left': {
		left: 15,
		right: 'auto'
	},
	'spinner-right': {
		left: 'auto',
		right: 15
	},
	spinnerIcon: {
		width: 18,
		height: 18,
		boxSizing: 'border-box',
		borderStyle: 'solid',
		borderWidth: 2,
		borderColor: 'transparent',
		borderRadius: '50%',
		animation: 'x 400ms linear infinite',
		animationName: spinnerKeyframes
	}
};


export default Radium(ProgressBar);
