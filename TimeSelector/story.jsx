import TimeSelector from './index';
import React  from 'react';
import {storiesOf, action} from '@kadira/storybook';
import RebassThemes from '../RebassThemes';

class Wrapper extends React.Component {
	constructor() {
		super();
		this.state = {
			hour: '1',
			minutes: '25',
			isAM: true
		};
	}

	render() {
		return <TimeSelector
			{...this.props}
			isAM={this.state.isAM}
			hour={this.state.hour}
			minutes={this.state.minutes}
			onChange={ (hour, minutes, isAM) => this.setState({
				hour: hour,
				minutes: minutes,
				isAM: isAM
			})}
		/>
	}
}

storiesOf('TimeSelector', module)
	.add('time selector with default values', () => (
		<RebassThemes>
			<Wrapper />
		</RebassThemes>
	));

