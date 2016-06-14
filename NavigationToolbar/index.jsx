import React from 'react';
import ReactDOM from 'react-dom';
import { Base, Toolbar } from 'rebass';

export default class NavigationToolbar extends React.Component {
	static contextTypes = {
		rebass: React.PropTypes.object
	};
	
	constructor(){
		super();
		this.state = {
			styling: {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0
			},
			scrollTop: 0
		};
		this.scrollHandler = this.scrollHandler.bind(this);
		this.toggle = this.toggle.bind(this);
	}
	
	scrollHandler(event) {
		let nodeHeight = ReactDOM.findDOMNode(this).offsetHeight;
		let direction = this.state.scrollTop - document.body.scrollTop > 0;
		this.setState({
			styling: {
				...this.state.styling,
				transition: undefined,
				top: Math.max(-nodeHeight, Math.min(0, this.state.styling.top + this.state.scrollTop - document.body.scrollTop))
			},
			scrollTop: document.body.scrollTop,
			lastScrollDirectionUp: direction
		});
		if (this.props.onScroll) {
			this.props.onScroll(direction);
		}
	}
	
	toggle() {
		this.setState({
			styling: {
				...this.state.styling,
				transition: 'all 0.3s ease-in-out',
				top: (this.state.styling.top === 0) ? -ReactDOM.findDOMNode(this).offsetHeight : 0
			},
			lastScrollDirectionUp: this.state.styling.top !== 0
		});
	}
	
	componentWillMount(){
		window.addEventListener('scroll', this.scrollHandler);
	}
	
	componentWillUnmount() {
		window.removeEventListener('scroll', this.scrollHandler);
	}
	
	render() {
		let {children, ...props} = this.props;
		let toggleBottom =  (this.state.lastScrollDirectionUp || this.state.styling.top <= -this.state.scrollTop) ? 0 : -26;
		return <Base className='NavigationToolbar' baseStyle={this.state.styling} inverted={true} theme="primary" {...props}>
			<Toolbar p={0}>
				<Base className="NavigationToolbar Toggle" onClick={this.toggle} inverted={true} theme="primary" baseStyle={{
					height: 22,
					position: 'absolute',
					right: 12,
					bottom: toggleBottom,
					borderBottomLeftRadius: 4,
					borderBottomRightRadius: 4,
					padding: '8px 8px 4px',
					transition: 'all 0.3s ease-in-out',
					cursor: 'pointer',
					visibility: (this.state.styling.top === -this.state.scrollTop) ? 'hidden' : 'visible'
				}}>
					<i className={'fa fa-fw fa-caret-' + ((toggleBottom === 0) ? 'up': 'down')}/>
				</Base>
				{React.Children.map(children, child => {
					return React.cloneElement(child, {
						style: {
							...child.props.style,
							display: 'inline-block',
							position: 'relative',
							height: '100%'
						}
					})
				})}
			</Toolbar>
		</Base>;
	}
}
