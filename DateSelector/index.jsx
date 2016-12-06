import React, {PropTypes}  from 'react';
import DateRangePicker from 'react-dates/lib/components/DateRangePicker';
import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import {Base, Button, Label, Select, Space} from 'rebass'
import rebassConfig from 'rebass/dist/config';
import {Style} from 'radium'
import TimeSelector from '../TimeSelector'
import ToggleButton from '../Stateless/ToggleButton'
import { Flex, Box } from 'reflexbox'

class DateSelector extends React.Component {
	static propTypes = {
		startDate: PropTypes.object,  // Moment object
		endDate: PropTypes.object,
		date: PropTypes.object,
		dateMode: PropTypes.string,

		hourAfter: PropTypes.number,
		minutesAfter: PropTypes.number,
		isAMAfter: PropTypes.bool,

		hourBefore: PropTypes.number,
		minutesBefore: PropTypes.number,
		isAMBefore: PropTypes.bool,

		repeatOption: PropTypes.string,
		repeatUntil: PropTypes.object,

		Mon: PropTypes.bool,   // default value for day selection
		Tue: PropTypes.bool,
		Wed: PropTypes.bool,
		Thu: PropTypes.bool,
		Fri: PropTypes.bool,
		Sat: PropTypes.bool,
		Sun: PropTypes.bool,

		addCalendar: PropTypes.func.isRequired

	};

	static contextTypes = {
		rebass: React.PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			focusedInput: null,  // date range picker
			startDate: this.props.startDate || null,
			endDate: this.props.endDate || null,

			dateFocused: false,  // single date picker
			date: this.props.date || null,

			dateMode: this.props.dateMode || 'Date',

			hourAfter: (this.props.hourAfter === undefined? 12 : this.props.hourAfter) + '',   // initial value for After, convert to string since <select> value is string
			minutesAfter: (this.props.minutesAfter === undefined? 0 : this.props.minutesAfter) + '',
			isAMAfter: this.props.isAMAfter === undefined? true : this.props.isAMAfter,


			hourBefore: (this.props.hourBefore === undefined? 11 : this.props.hourBefore) + '',  // inital value for Before
			minutesBefore: (this.props.minutesBefore === undefined? 59 : this.props.minutesBefore) + '',
			isAMBefore: this.props.isAMBefore === undefined? false : this.props.isAMBefore,

			repeatOption: this.props.repeatOption || 'Does Not Repeat',
			repeatUntil: this.props.repeatUntil || null,
			focusedUntil: false,

			Mon: this.props.Mon === undefined? false : this.props.Mon,   // default value for day selection
			Tue: this.props.Tue === undefined? false : this.props.Tue,
			Wed: this.props.Wed === undefined? false : this.props.Wed,
			Thu: this.props.Thu === undefined? false : this.props.Thu,
			Fri: this.props.Fri === undefined? false : this.props.Fri,
			Sat: this.props.Sat === undefined? false : this.props.Sat,
			Sun: this.props.Sun === undefined? false : this.props.Sun

		};
		this.onDateModeChange = this.onDateModeChange.bind(this);

		this.onDatesChange = this.onDatesChange.bind(this);
		this.onFocusInputChange = this.onFocusInputChange.bind(this);

		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.onDateRepeatOptionChange = this.onDateRepeatOptionChange.bind(this);

		this.onUntilDateChange = this.onUntilDateChange.bind(this);
		this.onUntilFocusChange = this.onUntilFocusChange.bind(this);

		this.toggleDay = this.toggleDay.bind(this);
		this.addToCalendar = this.addToCalendar.bind(this);
	}

	onDateModeChange(event){
		const dateMode = event.target.value;

		let changedState = {
			dateMode: dateMode,
			startDate: null,
			endDate: null,
			date: null,
			repeatUntil: null,

			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false,
			Sat: false,
			Sun: false
		};

		if (dateMode !== 'Before') {
			changedState = Object.assign({}, changedState, {
				hourAfter: '12',   // default value for After
				minutesAfter: '0',
				isAMAfter: true,
			});
		}

		if (dateMode !== 'After') {
			changedState = Object.assign({}, changedState, {
				hourBefore: '11',  // default value for Before
				minutesBefore: '59',
				isAMBefore: false
			});
		}

		this.setState(changedState);
	}

	onDatesChange({startDate, endDate}) {
		console.log('startDate: ', startDate);
		this.setState({startDate, endDate});
	}

	onFocusInputChange(focusedInput) {
		this.setState({focusedInput});
	}

	onDateChange(date) {
		this.setState({ date });
	}

	onFocusChange({focused}) {
		this.setState({dateFocused: focused});
	}


	onUntilDateChange(repeatUntil) {
		this.setState({ repeatUntil });
	}

	onUntilFocusChange({focused}) {
		this.setState({focusedUntil: focused});
	}

	onDateRepeatOptionChange(event){
		this.setState({
			repeatOption: event.target.value,
			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false,
			Sat: false,
			Sun: false});
	}

	toggleDay(day){
		const isDaySelected = this.state[day] ? false : true;
		this.setState({[day]: isDaySelected});
	}

	addToCalendar(){
		//TODO validation
		const data = {
			startDate: this.state.startDate,
			endDate: this.state.endDate,
			date: this.state.date,
			dateMode: this.state.dateMode,

			hourAfter: this.state.hourAfter,
			minutesAfter: this.state.minutesAfter,
			isAMAfter: this.state.isAMAfter,

			hourBefore: this.state.hourBefore,
			minutesBefore: this.state.minutesBefore,
			isAMBefore: this.state.isAMBefore,

			repeatOption: this.state.repeatOption,
			repeatUntil: this.state.repeatUntil,

			Mon: this.state.Mon,   // default value for day selection
			Tue: this.state.Tue,
			Wed: this.state.Wed,
			Thu: this.state.Thu,
			Fri: this.state.Fri,
			Sat: this.state.Sat,
			Sun: this.state.Sun
		};
		this.props.addCalendar(data);
	}

	render() {
		const {focusedInput, startDate, endDate, date, dateFocused, repeatUntil, focusedUntil} = this.state;
		const {scale, colors, borderColor, fontSizes, themeColour} = {...{themeColour: 'primary'}, ...rebassConfig, ...this.context.rebass};
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
			{children: 'Every Monday', value: 'Every Monday'},
			{children: 'Every Tuesday', value: 'Every Tuesday'},
			{children: 'Every Wednesday', value: 'Every Wednesday'},
			{children: 'Every Thursday', value: 'Every Thursday'},
			{children: 'Every Friday', value: 'Every Friday'},
			{children: 'Every Saturday', value: 'Every Saturday'},
			{children: 'Every Sunday', value: 'Every Sunday'},
			{children: 'Custom', value: 'Custom'}
			];

		//const allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		const allWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

		return (
			<Base className="DateSelectorComponent" baseStyle={{
				color: colors.black || 'black',
				fontSize: fontSizes[5]
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
						value={this.state.dateMode}
						onChange={this.onDateModeChange}
					/>
					<Space x={1}/>

					{ this.state.dateMode === 'Range' ? <DateRangePicker
						onDatesChange={this.onDatesChange}
						onFocusChange={this.onFocusInputChange}
						focusedInput={focusedInput}
						startDate={startDate}
						endDate={endDate}
						numberOfMonths={1}
					/> : <SingleDatePicker
						id="date_input"
						onDateChange={this.onDateChange}
						onFocusChange={this.onFocusChange}
						focused={dateFocused}
						date={date}
						numberOfMonths={1}
					/>}
				</div>

				{
					(this.state.dateMode !== 'Before') &&
					<div>
						<Label>After</Label>
						<TimeSelector

							isAM={this.state.isAMAfter}
							hour={this.state.hourAfter}
							minutes={this.state.minutesAfter}
							onChange={(hour, minutes, isAM) => this.setState({
								hourAfter: hour,
								minutesAfter: minutes,
								isAMAfter: isAM
							})}
						/>
					</div>
				}

				{
					(this.state.dateMode !== 'After') &&
					<div>
						<Label>Before</Label>
						<TimeSelector
							isAM={this.state.isAMBefore}
							hour={this.state.hourBefore}
							minutes={this.state.minutesBefore}
							onChange={(hour, minutes, isAM) => this.setState({
								hourBefore: hour,
								minutesBefore: minutes,
								isAMBefore: isAM
							})}
						/>
					</div>
				}

				{
					(this.state.dateMode === 'Date') &&
					<Flex wrap>
						<Box>
							<Label> Repeat </Label>
							<Select
								label=""
								name="select_repeat_options"
								options={repeatOptions}
								rounded
								style={{width: (scale[4] || 64) + 96}}
								value={this.state.repeatOption}
								onChange={this.onDateRepeatOptionChange}
							/>
						</Box>
						<Space x={1}/>
						{
							(this.state.repeatOption !== 'Does Not Repeat' &&

								<Box>
									<Label> Until </Label>
									<div>
										<SingleDatePicker
											id="date_until_input"
											onDateChange={this.onUntilDateChange}
											onFocusChange={this.onUntilFocusChange}
											focused={focusedUntil}
											date={repeatUntil}
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
					(this.state.dateMode === 'Date' && this.state.repeatOption === 'Custom') &&
					allWeekDays.map( day => {
					return <ToggleButton key={day}
					                     selected={this.state[day]}
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

				<ToggleButton selected={true}
				              onClick={this.addToCalendar}
				              style={{
					              width: 80,
					              marginTop: (scale[2] || 8) + 2
				              }}
				              theme={themeColour}>
					Add
				</ToggleButton>

			</Base>
		);
	}
}

export default DateSelector;