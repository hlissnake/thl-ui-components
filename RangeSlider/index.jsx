import React, {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';

// requestAniamtionFrame
const RAF = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.MozRequestAnimationFrame ||
	(callback => setTimeout(callback));

const Style = {
	boxBase: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: 30
	},
	
	boxBorder: {
		position: 'absolute',
		top: 0,
		height: 30,
		backgroundColor: '#999',
		cursor: 'col-resize'
	},
	
	sliderBase: {
		position: 'relative',
		left: 0,
		top: 0,
		height: 30,
		overflow: 'hidden',
		borderRadius: 4,
		border: '1px solid #ccc'
	}
};

/**
 * Range Box Component
 */
@Radium
class RangeBox extends Component {
	
	static propTypes = {
		start: PropTypes.number,
		end: PropTypes.number,
		max: PropTypes.number
	};
	
	constructor(props) {
		super(props);
		
		this.holding = false;
		this.holdingLeft = false;
		this.holdingRight = false;
		
		this.pointX = 0;
		
		this.state = {
			start: props.start,
			end: props.end
		}
	}
	
	componentDidMount() {
		// Get current dom reference
		this.domStyle = this.refs.slider.style;
		// const x1 = this.state.start,
		// 	x2 = this.state.end,
		// 	boxWidth = x2 - x1;
		//
		// this.domStyle.width = boxWidth + 'px';
		// this.domStyle.webkitTransform = `translateX(${x1}px) translateZ(0)`;
		// console.log(boxWidth);
		// console.log(x1);
		
		document.body.addEventListener('mousemove', this.onMove.bind(this));
		document.body.addEventListener('mouseup', this.onBodyRelease.bind(this));
	}
	
	componentWillUnmount() {
		document.body.removeEventListener('mousemove', this.onMove.bind(this));
		document.body.addEventListener('mouseup', this.onBodyRelease.bind(this));
	}
	
	render() {
		
		return <div
			style={[
				Style.boxBase
			]}>
			<div className="slider-box"
			     ref="slider"
			     style={[
				     Style.boxBase,
				     {
					     width: this.state.end - this.state.start,
					     transform: `translateX(${this.state.start}px) translateZ(0)`
				     }
			     ]}>
				
				<div className="box"
				     style={[
					     Style.boxBorder,
					     {
						     left: 0,
						     width: '100%',
						     backgroundColor: '#ccc',
						     cursor: 'move'
					     }
				     ]}
				     onMouseDown={this.onHold.bind(this)}></div>
				
				<div className="border-left"
				     style={[
					     Style.boxBorder,
					     {
						     left: 0,
						     width: 8
					     }
				     ]}
				     onMouseDown={this.onHoldLeftBorder.bind(this)}></div>
				
				<div className="border-right"
				     style={[
					     Style.boxBorder,
					     {
						     right: 0,
						     width: 8
					     }
				     ]}
				     onMouseDown={this.onHoldRightBorder.bind(this)}></div>
			</div>
		</div>
	}
	
	onChange(newStart, newEnd) {
		
		RAF(() => {
			// this.props.onChange(newStart, newEnd);
			
			// const boxWidth = newEnd - newStart;
			// this.domStyle.width = boxWidth + 'px';
			// this.domStyle.webkitTransform = `translateX(${newStart}px) translateZ(0)`;
			// console.log(boxWidth); console.log(newStart);
			this.setState({
				start: newStart,
				end: newEnd
			});
		});
	}
	
	onHold(e) {
		this.holding = true;
		this.pointX = e.pageX;
		this.startX = this.state.start;
		this.endX = this.state.end;
	}
	
	onRelease(e) {
		this.startX = this.state.start;
		this.endX = this.state.end;
		this.holding = false;
	}
	
	onHoldLeftBorder(e) {
		this.holdingLeft = true;
		this.pointX = e.pageX;
		this.startX = this.state.start;
	}
	
	onReleaseLeftBorder(e) {
		this.holdingLeft = false;
		this.startX = this.state.start;
	}
	
	onHoldRightBorder(e) {
		this.holdingRight = true;
		this.pointX = e.pageX;
		this.endX = this.state.end;
	}
	
	onReleaseRightBorder(e) {
		this.holdingRight = false;
		this.endX = this.state.end;
	}
	
	onBodyRelease() {
		if (this.holding) {
			this.onRelease();
		}
		if (this.holdingLeft) {
			this.onReleaseLeftBorder();
		}
		if (this.holdingRight) {
			this.onReleaseRightBorder();
		}
		this.props.onChange(this.state.start, this.state.end);
	}
	
	onMove(e) {
		const translate = e.pageX - this.pointX;
		
		if (this.holding) {
			let newStart = this.startX + translate,
				newEnd = this.endX + translate;
			
			if (newStart > 0 && newEnd < this.props.max) {
				this.onChange(newStart, newEnd);
			}
		} else if (this.holdingRight) {
			let newEnd = this.endX + translate;
			
			if (newEnd < this.props.max) {
				this.onChange(this.startX, newEnd);
			}
		} else if (this.holdingLeft) {
			let newStart = this.startX + translate;
			
			if (newStart > 0) {
				this.onChange(newStart, this.endX);
			}
		}
		
	}
}

/**
 * Range Slider Component
 */
@Radium
export default class RangeSlider extends Component {
	
	static propTypes = {
		domain: PropTypes.array,
		unit: PropTypes.any,
		start: PropTypes.any,
		end: PropTypes.any,
		width: PropTypes.number
	};
	
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	
	render() {
		const {start, end, domain, width, unit} = this.props;
		const startRange = this.calculateStartRange(domain, start, end, width, unit);
		
		return <div className="range-slider"
		            style={[
			            Style.sliderBase,
			            {
				            width: width
			            }
		            ]}>
			<i className="backward"></i>
			
			<div className="slider-container">
				<div className="slider-list"
				     style={[
					     Style.boxBase,
					     {
						     width: '100%',
					     }
				     ]}>
					{/*{this.getDomainLine(domain)}*/}
				</div>
				<RangeBox
					onChange={this.onChange.bind(this)}
					start={startRange[0]}
					end={startRange[1]}
					max={width}/>
			</div>
			
			<i className="forward"></i>
		</div>;
	}
	
	onChange(x1, x2) {
		if (this.props.onChange) {
			let range, start, end;
			const {domain, unit, width} = this.props;
			
			switch (unit) {
				case 'date':
					range = [domain[0].getTime(), domain[1].getTime()];
					const length = range[1] - range[0];
					start = (x1 * length / width) + range[0];
					end = (x2 * length / width) + range[0];
					start = new Date(start);
					end = new Date(end);
					break;
				case 'hour':
					break;
				default:
					break;
			}
			this.props.onChange([
				start, end
			]);
		}
	}
	
	calculateStartRange(domain, start, end, width, unit = 1) {
		
		switch (unit) {
			case 'date':
				domain = [domain[0].getTime(), domain[1].getTime()];
				start = start.getTime();
				end = end.getTime();
				break;
			case 'hour':
				break;
			default:
				break;
		}
		const length = domain[1] - domain[0];
		const range = [width * (start - domain[0]) / length, width * (end - domain[0]) / length];
		
		return range;
	}
	
	getDomainList(domain, unit = 1) {
		
		const domainList = [];
		switch (unit) {
			case 'date':
				
				break;
			case 'hour':
				break;
			default:
				for (let i = domain[0]; i <= domain[1]; i += unit) {
					domainList.push(i);
				}
		}
		
		return domainList;
	}
	
	getDomainLine(domain, unit) {
		const domainList = this.getDomainList(domain, unit);
		
		return domainList.map((datum, i)=> {
			
			return <span key={i}>
				{datum}
			</span>
		});
	}
}