import DateSelector from './index';
import React  from 'react';
import {storiesOf, action} from '@kadira/storybook';
import RebassThemes from '../RebassThemes';
import 'react-dates/lib/css/_datepicker.css';
import rebassConfig from 'rebass/dist/config';
import moment from 'moment';
import {IntlProvider, addLocaleData} from 'react-intl';

import zhLocaleData from 'react-intl/locale-data/zh';
import cnLocaleData from './cn.json'

addLocaleData(zhLocaleData);

const basicTheme = {
	...rebassConfig,

	Button: {
		padding: 8,
		border: '1px solid black',
		borderRadius: '4px'
	},
	ButtonOutline: {
		padding: 8,
		border: '1px solid black',
		borderRadius: '4px'
	},
	Label: {
		lineHeight: 2
	}
};


const themePrimary = {...basicTheme,
	colors: {
		primary: '#03d0ab'
	}
};

const themeBigger = {...basicTheme,
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

class Wrapper extends React.Component {
	constructor() {
		super();
		this.state = {

			dateMode: 'Date',
			startDate: moment(),
			endDate: moment().add(10, 'days'),
			date: moment().add(1, 'days'),

			startTime: moment(),
			endTime: moment().add(1, 'hours'),

			repeatOption: 'Custom',
			repeatUntilDate: moment().add(20, 'days'),
			customDays: ['Mon', 'Sat']

		};
	}

	render() {
		return <DateSelector
			{...this.props}
			dateMode={this.state.dateMode}
			startDate={this.state.startDate}
			endDate={this.state.endDate}
			date={this.state.date}
			startTime={this.state.startTime}
			endTime={this.state.endTime}
			repeatOption={this.state.repeatOption}
			repeatUntilDate={this.state.repeatUntilDate}
			customDays={this.state.customDays}
			onChange={ (dateMode, startDate, endDate, date, startTime, endTime, repeatOption, repeatUntilDate, customDays) => this.setState({
				dateMode: dateMode,
				startDate: startDate,
				endDate: endDate,
				date: date,
				startTime: startTime,
				endTime: endTime,
				repeatOption: repeatOption,
				repeatUntilDate: repeatUntilDate,
				customDays: customDays

			})}
			onSubmit={action('submit')}
		/>
	}
}

storiesOf('DateSelector', module)
.add('default', () => (
	<RebassThemes theme={basicTheme}>
		<IntlProvider defaultLocale="en-NZ"
		              locale="en-NZ">
			<Wrapper useDefaultValidation={true}/>
		</IntlProvider>
	</RebassThemes>
))
.add('theme is primary green', () => (
	<RebassThemes theme={themePrimary}>
		<IntlProvider defaultLocale="en-NZ"
		              locale="en-NZ">
			<Wrapper useDefaultValidation={true}/>
		</IntlProvider>
	</RebassThemes>
))
.add('size 5 pixel bigger', () => (
	<RebassThemes theme={themeBigger}>
		<IntlProvider defaultLocale="en-NZ"
		              locale="en-NZ">
			<Wrapper useDefaultValidation={true}/>
		</IntlProvider>
	</RebassThemes>
))
.add('default duration 1 year for "After"', () => (
	<RebassThemes theme={basicTheme}>
		<IntlProvider defaultLocale="en-NZ"
		              locale="en-NZ">
			<Wrapper useDefaultValidation={true}
				defaultDuration={moment.duration(1, 'years')}
			/>
		</IntlProvider>
	</RebassThemes>
))
.add('disable default validation', () => (
	<RebassThemes theme={basicTheme}>
		<IntlProvider defaultLocale="en-NZ"
		              locale="en-NZ">
			<Wrapper useDefaultValidation={false}
			/>
		</IntlProvider>
	</RebassThemes>
))
.add('Simplified Chinese translations', () => (
	<RebassThemes theme={basicTheme}>
		<IntlProvider defaultLocale="zh-cn"
		              locale="zh"
		              messages={cnLocaleData}>
			<Wrapper useDefaultValidation={true}
			/>
		</IntlProvider>
	</RebassThemes>
));