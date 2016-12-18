import React, {PropTypes}  from 'react';
import DateRangePicker from 'react-dates/lib/components/DateRangePicker';
import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import {Base, Label, Message, Select, Space} from 'rebass'
import rebassConfig from 'rebass/dist/config';
import {Style} from 'radium'
import TimeSelector from '../TimeSelector'
import ToggleButton from '../Stateless/ToggleButton'
import {Flex, Box} from 'reflexbox'
import momentPropTypes from 'react-moment-proptypes'
import {convertTimeFromMomentObj, convertTimeToMomentObj, convertDateTimeToMomentObj, validate} from './helper'
import moment from 'moment';

class DateSelector extends React.Component {
	static propTypes = {
		defaultDuration: momentPropTypes.momentDurationObj,

		dateMode: PropTypes.string,
		startDate: momentPropTypes.momentObj,
		endDate: momentPropTypes.momentObj,
		date: momentPropTypes.momentObj,

		startTime: momentPropTypes.momentObj,
		endTime: momentPropTypes.momentObj,

		repeatOption: PropTypes.string,
		repeatUntilDate: momentPropTypes.momentObj,
		customDays: PropTypes.array,

		onChange: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,

		useDefaultValidation: PropTypes.bool.isRequired
	};

	static contextTypes = {
		rebass: React.PropTypes.object
	};

	constructor(props) {
		super(props);

		this.state = {
			focusedInput: null,  // date range picker
			dateFocused: false,  // single date picker
			focusedUntil: false,
			errorMessage: ''
		};
		this.onDateModeChange = this.onDateModeChange.bind(this);

		this.onDatesChange = this.onDatesChange.bind(this);
		this.onFocusInputChange = this.onFocusInputChange.bind(this);

		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.onDateRepeatOptionChange = this.onDateRepeatOptionChange.bind(this);

		this.onUntilDateChange = this.onUntilDateChange.bind(this);
		this.onUntilFocusChange = this.onUntilFocusChange.bind(this);

		this.onStartTimeChange = this.onStartTimeChange.bind(this);
		this.onEndTimeChange = this.onEndTimeChange.bind(this);
		this.toggleDay = this.toggleDay.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onDateModeChange(event) {
		const dateMode = event.target.value;

		//reset values
		let startTime = null;
		let endTime = null;

		if (dateMode !== 'Before') {
			startTime = convertTimeToMomentObj('12', '0', true);
		}

		if (dateMode !== 'After') {
			endTime = convertTimeToMomentObj('11', '59', false);
		}

		this.props.onChange(dateMode, null, null, null,
			startTime, endTime,
			null, null, []);
	}

	onDatesChange({startDate, endDate}) {
		this.props.onChange(this.props.dateMode, startDate, endDate, this.props.date,
			this.props.startTime, this.props.endTime,
			this.props.repeatOption, this.props.repeatUntilDate, this.props.customDays);
	}

	onFocusInputChange(focusedInput) {
		this.setState({focusedInput});
	}

	onDateChange(date) {
		let {startDate, endDate, endTime} = this.props;
		if (this.props.dateMode === 'After') {
			startDate = date;
			const duration = this.props.defaultDuration || moment.duration(90, 'days');
			endDate = moment(startDate).add(duration);
			endTime = convertTimeToMomentObj('11', '59', false);
		}

		if (this.props.dateMode === 'Before') {
			endDate = date;
		}
		this.props.onChange(this.props.dateMode, startDate, endDate, date,
			this.props.startTime, endTime,
			this.props.repeatOption, this.props.repeatUntilDate, this.props.customDays);
	}

	onFocusChange({focused}) {
		this.setState({dateFocused: focused});
	}


	onUntilDateChange(repeatUntil) {
		this.props.onChange(this.props.dateMode, this.props.startDate, this.props.endDate, this.props.date,
			this.props.startTime, this.props.endTime,
			this.props.repeatOption, repeatUntil, this.props.customDays);
	}

	onUntilFocusChange({focused}) {
		this.setState({focusedUntil: focused});
	}

	onDateRepeatOptionChange(event) {
		this.props.onChange(this.props.dateMode, this.props.startDate, this.props.endDate, this.props.date,
			this.props.startTime, this.props.endTime,
			event.target.value, this.props.repeatUntilDate, []);
	}

	onStartTimeChange(hour, minutes, isAM) {
		this.props.onChange(this.props.dateMode, this.props.startDate, this.props.endDate, this.props.date,
							convertTimeToMomentObj(hour, minutes, isAM), this.props.endTime,
							this.props.repeatOption, this.props.repeatUntilDate, this.props.customDays);
	}

	onEndTimeChange(hour, minutes, isAM) {
		this.props.onChange(this.props.dateMode, this.props.startDate, this.props.endDate, this.props.date,
			this.props.startTime, convertTimeToMomentObj(hour, minutes, isAM),
			this.props.repeatOption, this.props.repeatUntilDate, this.props.customDays);
	}

	toggleDay(day) {
		let newCustomDays = this.props.customDays.slice();
		const index = this.props.customDays.indexOf(day);

		if (index > -1) {
			newCustomDays.splice(index, 1);
		}
		else {
			newCustomDays.push(day);
		}
		this.setState({customDays: newCustomDays});
		this.props.onChange(this.props.dateMode, this.props.startDate, this.props.endDate, this.props.date,
			this.props.startTime, this.props.endTime,
			this.props.repeatOption, this.props.repeatUntilDate, newCustomDays);
	}

	onSubmit() {

		if (this.props.useDefaultValidation === true) {
			let startDateTime;
			let endDateTime;

			switch (this.props.dateMode) {
				case 'Date':
					startDateTime = convertDateTimeToMomentObj(this.props.date, this.props.startTime);
					endDateTime = convertDateTimeToMomentObj(this.props.date, this.props.endTime);
					break;
				case 'Before':
					startDateTime = moment();
					endDateTime = convertDateTimeToMomentObj(this.props.endDate, this.props.endTime);
					break;
				default:
					startDateTime = convertDateTimeToMomentObj(this.props.startDate, this.props.startTime);
					endDateTime = convertDateTimeToMomentObj(this.props.endDate, this.props.endTime);
					break;
			}

			const repeatUntilDate = this.props.repeatUntilDate == null ? null : moment(this.props.repeatUntilDate).hour(23).minute(59);

			const errorMessage = validate(this.props.dateMode, startDateTime, endDateTime, this.props.repeatOption, repeatUntilDate, this.props.customDays);
			this.setState({errorMessage: errorMessage});

			if (errorMessage.length > 0) {
				return;
			}
		}

		this.props.onSubmit(this.props.dateMode, this.props.startDate, this.props.endDate, this.props.date,
			this.props.startTime, this.props.endTime,
			this.props.repeatOption, this.props.repeatUntilDate, this.props.customDays);
	}

	render() {
		const {focusedInput, dateFocused, focusedUntil} = this.state;
		const {scale, colors, fontSizes, themeColour} = {...{themeColour: 'primary'}, ...rebassConfig, ...this.context.rebass};
		const dateOptions = [
			{children: 'After', value: 'After'},
			{children: 'Before', value: 'Before'},
			{children: 'Range', value: 'Range'},
			{children: 'Date', value: 'Date'}];

		const repeatOptions = [
			{children: 'Does Not Repeat', value: 'Does Not Repeat'},
			{children: 'Daily', value: 'Daily'},
			{children: 'Week Days', value: 'Week Days'},
			{children: 'Weekend', value: 'Weekend'},
			{children: 'Weekly', value: 'Weekly'},
			{children: 'Fortnightly', value: 'Fortnightly'},
			{children: 'Monthly', value: 'Monthly'},
			{children: 'Yearly', value: 'Yearly'},
			{children: 'Custom', value: 'Custom'}
		];

		const allWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

		let {hour:hourAfter, minutes:minutesAfter, isAM:isAMAfter} = convertTimeFromMomentObj(this.props.startTime);
		let {hour:hourBefore, minutes:minutesBefore, isAM:isAMBefore} = convertTimeFromMomentObj(this.props.endTime);

		return (
			<Base className="DateSelectorComponent" baseStyle={{
				color: colors.black || 'black',
				fontSize: fontSizes[5],
				maxWidth: (scale[4] || 64) * 4 + 44
			}}>
				<Style scopeSelector=".DateSelectorComponent" rules={{
					'.DateInput': {
						padding: 0,
						fontSize: fontSizes[5],
						width: 'auto',
						lineHeight: (scale[2] || 16) + 6 + 'px'  // for some reason it needs 'px' here
					},
					'.DateRangePickerInput__arrow svg': {
						height: (scale[2] || 16) + 2,
						width: (scale[2] || 16) + 2
					},
					'.SingleDatePicker__picker': {
						top: (scale[3] || 32) + 11
					},
					'.DateRangePicker__picker': {
						top: (scale[3] || 32) + 11
					},
					'.DateInput--with-caret::after': {
						top: (scale[3] || 32) + 2
					},
					'.DateInput--with-caret::before': {
						top: (scale[3] || 32) + 1
					},
					'.DayPickerNavigation--horizontal .DayPickerNavigation__prev, .DayPickerNavigation--horizontal .DayPickerNavigation__next': {
						paddingTop: (scale[0] || 0) + 4,
						paddingBottom: (scale[0] || 0) + 4
					},
					'.CalendarMonth__day--selected-start, .CalendarMonth__day--selected-end, .CalendarMonth__day--selected': {
						//background: 'black',
						//borderColor: 'black'
					},
					'.CalendarMonth__day--selected-span': {
						//background: 'black',
						//borderColor: 'black',
						//opacity: 0.6
					}
				}}/>
				<Label>Select Dates</Label>
				<div style={{display: 'flex'}}>
					<Select
						label=""
						name="select_date_type"
						options={dateOptions}
						rounded
						style={{width: (scale[4] || 64) + 36}}
						value={this.props.dateMode}
						onChange={this.onDateModeChange}
					/>
					<Space x={1}/>

					{ this.props.dateMode === 'Range' ? <DateRangePicker
						onDatesChange={this.onDatesChange}
						onFocusChange={this.onFocusInputChange}
						focusedInput={focusedInput}
						startDate={this.props.startDate}
						endDate={this.props.endDate}
						numberOfMonths={1}
					/> : <SingleDatePicker
						id="date_input"
						onDateChange={this.onDateChange}
						onFocusChange={this.onFocusChange}
						focused={dateFocused}
						date={this.props.date}
						numberOfMonths={1}
					/>}
				</div>

				{
					(this.props.dateMode !== 'Before') &&
					<div>
						<Label>After</Label>
						<TimeSelector
							isAM={isAMAfter === null ? true : isAMAfter }
							hour={hourAfter || '00'}
							minutes={minutesAfter || '00'}
							onChange={this.onStartTimeChange}
						/>
					</div>
				}

				{
					(this.props.dateMode !== 'After') &&
					<div>
						<Label>Before</Label>
						<TimeSelector
							isAM={isAMBefore === null ? false : isAMBefore}
							hour={hourBefore || '11'}
							minutes={minutesBefore || '59'}
							onChange={this.onEndTimeChange}
						/>
					</div>
				}

				{
					(this.props.dateMode === 'Date') &&
					<Flex wrap>
						<Box>
							<Label> Repeat </Label>
							<Select
								label=""
								name="select_repeat_options"
								options={repeatOptions}
								rounded
								style={{width: (scale[4] || 64) + 96}}
								value={this.props.repeatOption}
								onChange={this.onDateRepeatOptionChange}
							/>
						</Box>
						<Space x={1}/>
						{
							(this.props.repeatOption !== 'Does Not Repeat' &&

								<Box>
									<Label> Until </Label>
									<div>
										<SingleDatePicker
											id="date_until_input"
											onDateChange={this.onUntilDateChange}
											onFocusChange={this.onUntilFocusChange}
											focused={focusedUntil}
											date={this.props.repeatUntilDate}
											numberOfMonths={1}
										/>
									</div>
								</Box>
							)
						}
						<Space x={1}/>
					</Flex>
				}
				<Flex wrap>

					{
						(this.props.dateMode === 'Date' && this.props.repeatOption === 'Custom') &&
						allWeekDays.map(day => {
							return <ToggleButton key={day}
							                     selected={this.props.customDays.indexOf(day) > -1}
							                     onClick={() => this.toggleDay(day)}
							                     theme={themeColour}
							                     style={{
								                     marginRight: (scale[0] || 0) + 5
							                     }}
							                     pill
							>
								{day}
							</ToggleButton>
						})

					}
				</Flex>

				{
					(this.props.useDefaultValidation && this.state.errorMessage.length > 1) &&


					<Message
						rounded
						theme="error"
						style={{
							marginTop: (scale[0] || 0) + 2,
							marginBottom: 0,
							fontWeight: 'normal'
						}}
					>
						{this.state.errorMessage}
					</Message>
				}

				<ToggleButton selected={true}
				              onClick={this.onSubmit}
				              style={{
					              width: (scale[4] || 64) + 16,
					              marginTop: (scale[0] || 0) + 5


				              }}
				              theme={themeColour}>
					Add
				</ToggleButton>


			</Base>
		);
	}
}

export default DateSelector;

