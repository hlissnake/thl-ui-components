import React, {Component, PropTypes} from 'react';
import Radium, {Style} from 'radium';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Message from 'rebass/dist/Message';
import Space from 'rebass/dist/Space';
import Close from 'rebass/dist/Close';
import config from 'rebass/dist/config';

class AlertMessages extends Component {
	static contextTypes = {
		rebass: PropTypes.object
	};
	
	static propTypes = {
		messages: React.PropTypes.array.isRequired,
		clear: React.PropTypes.func.isRequired
	};
	
	keys = {};
	
	constructor() {
		super();
		this.awaitMessageTimeout = this.awaitMessageTimeout.bind(this);
	}
	
	awaitMessageTimeout(message) {
		let clearMessages = this.props.clear;
		let func = () => {
			clearMessages(message.key);
			delete this.keys[message.key];
		};
		this.keys[message.key] = {
			id: setTimeout(func, message.timeout || 8000),
			func
		};
	}
	
	componentWillMount() {
		this.props.messages.forEach(this.awaitMessageTimeout);
	}
	
	componentWillUnmount() {
		Object.keys(this.keys).map(key => {
			let {id, func} = this.keys[key];
			clearTimeout(id);
			func();
		});
		this.keys = {};
	}
	
	componentWillReceiveProps(nextProps) {
		nextProps.messages.forEach(message => {
			if (!this.keys[message.key]) {
				this.awaitMessageTimeout(message);
			}
		});
	}
	
	render() {
		const { scale, zIndex } = { ...config, ...this.context.rebass }
		return <div>
			<Style rules={{
				'.AlertMessages-enter': {
					transition: 'opacity 0.4s ease-in-out, margin-top 0.4s ease-in-out',
					marginTop: -60,
					opacity: 0
				},
				'.AlertMessages-enter-active': {
					marginTop: 0,
					opacity: 1
				},
				'.AlertMessages-leave': {
					transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
					transform: 'translateY(0px)',
					opacity: 1
				},
				'.AlertMessages-leave-active': {
					transform: 'translateY(30px)',
					opacity: 0
				}
			}}/>
			<ReactCSSTransitionGroup
				transitionName="AlertMessages"
				transitionEnterTimeout={400}
				transitionLeaveTimeout={400}
				style={{position: 'absolute', top: scale[1], right: scale[1], left: scale[1], zIndex: zIndex[1]}}
			>
				{this.props.messages.map((_message) => {
					let {theme, ...message} = _message;
					return <Message
						key={message.key}
						inverted
						rounded
						theme={theme}
						style={{boxShadow: '0px 0px 15px 0px rgba(80,80,80,0.75)'}}
					>
						{message.children}
						<Space
							auto
							x={1}
						/>
						<Close onClick={() => this.props.clear(message.key)}/>
					</Message>;
				})}
			</ReactCSSTransitionGroup>
		</div>;
	}
}

export default Radium(AlertMessages);
