import React, {PropTypes}  from 'react';
import {Label, Select, Space} from 'rebass'
import rebassConfig from 'rebass/dist/config';
import {Style} from 'radium'
import ToggleButton from '../Stateless/ToggleButton'

class TimeSelector extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		isAM: React.PropTypes.bool.isRequired,
		hour: React.PropTypes.string.isRequired,
		minutes: React.PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {themeColour, scale, fontSizes} = {...{themeColour: 'primary'}, ...rebassConfig, ...this.context.rebass};

		const hourOptions = [];
		for (let i = 1; i < 13; i++) {
			const iString = "" + i;
			hourOptions.push({children: iString.length === 1 ? '0' + iString : iString, value: iString});
		}
		const minuteOptions = [];
		for (var i = 0; i < 60; i++) {
			const iString = "" + i;
			minuteOptions.push({children: iString.length === 1 ? '0' + iString : iString, value: iString});
		}

		return (
			<div style={{display: 'flex'}}>
				<Select
					label=""
					hideLabel
					name="time_hour"
					options={hourOptions}
					rounded
					style={{width: scale[4] || 60}}
					value={this.props.hour}
				    onChange={(event) => {this.props.onChange(event.target.value, this.props.minutes, this.props.isAM)}}
				/>
				<Space x={1}/>
				<Label >:</Label>
				<Space x={1}/>
				<Select
					label=""
					hideLabel
					name="time_minute"
					options={minuteOptions}
					rounded
					style={{width: scale[4] || 60}}
					value={this.props.minutes}
					onChange={(event) => {this.props.onChange(this.props.hour, event.target.value, this.props.isAM)}}
				/>
				<Space x={1}/>
				<div>
					<ToggleButton
						selected={this.props.isAM}
						onClick={() => {this.props.onChange(this.props.hour, this.props.minutes, true)}}
						rounded="left"
						theme={themeColour}
					>
						am
					</ToggleButton>
					<ToggleButton
						selected={!this.props.isAM}
						onClick={() => {this.props.onChange(this.props.hour, this.props.minutes, false)}}
						rounded="right"
						theme={themeColour}
					>
						pm
					</ToggleButton>
				</div>
			</div>
		)
	}
}

export default TimeSelector;