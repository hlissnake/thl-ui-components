import addCal from './ical';
import DateSelector from './index';
import React  from 'react';
import {storiesOf, action} from '@kadira/storybook';
import RebassThemes from '../RebassThemes';
import 'react-dates/lib/css/_datepicker.css';
import rebassConfig from 'rebass/dist/config';
import moment from 'moment';

const themePrimary = {...rebassConfig,
	colors: {
		primary: '#03d0ab'
	}
};

const themeBigger = {...rebassConfig,
	fontSizes : [
		51,
		35,
		27,
		23,
		19,
		17,
		15
	],

	 scale : [
		5,
		13,
		21,
		37,
		128
	]
};

storiesOf('DateSelector', module)
.add('default', () => (
	<RebassThemes>
		<DateSelector addCalendar={action('add to calendar')}/>
	</RebassThemes>
))
.add('theme is primary green', () => (
	<RebassThemes theme={themePrimary}>
		<DateSelector addCalendar={action('add to calendar')}/>
	</RebassThemes>
))
.add('size 5 pixel bigger', () => (
	<RebassThemes theme={themeBigger}>
		<DateSelector addCalendar={action('add to calendar')}/>
	</RebassThemes>
))
.add('populate date and recurrences', () => (
	<RebassThemes>
		<DateSelector dateMode="Date" date={moment()}
		              hourAfter={10} minutesAfter={0} isAMAfter={true}
		              hourBefore={11} minutesBefore={0} isAMBefore={true}
		              repeatOption={'Custom'} repeatUntil={moment().add(10, 'days')}
		              Mon={true} Sat={true}
		              addCalendar={action('add to calendar')}
		/>
	</RebassThemes>
))
.add('populate date range', () => (
	<RebassThemes>
		<DateSelector dateMode="Range" startDate={moment()} endDate={moment().add(10, 'days')}
		              hourAfter={10} minutesAfter={0} isAMAfter={true}
		              hourBefore={11} minutesBefore={0} isAMBefore={false}
		              addCalendar={action('add to calendar')}
		/>
	</RebassThemes>
));