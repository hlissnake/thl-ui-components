import moment from 'moment';

/*
	dateTime is a moment string like '2016-12-12T23:00:00.000Z'
 */
export function convertTimeFromMomentObj(dateTime){

	if (dateTime === undefined) {
		return {
			hour: null,
			minutes: null,
			isAM: true
		};
	}

	return {
		hour: moment(dateTime).format('h'),
		minutes: moment(dateTime).format('mm'),
		isAM: moment(dateTime).format('a') === 'am',
	};
}

export function convertTimeToMomentObj(hour, minutes, isAM) {

	if (hour == undefined || minutes == undefined || isAM == undefined) {
		return null;
	}

	let momentString = '';
	momentString += hour.length === 1 ? '0' + hour : hour;
	momentString += ':';
	momentString += minutes.length === 1 ? '0' + minutes : minutes;
	momentString += isAM ? ' am' : ' pm';

	return moment(momentString, 'hh:mm a');
}

export function convertDateTimeToMomentObj(date, time) {
	if (date == undefined || time == undefined) {
		return null;
	}

	let momentString = moment(date).format('YYYYMMDD ') + moment(time).format('hh:mm a');
	return moment(momentString, 'YYYYMMDD hh:mm a');

}


/*
	The return is the error message
 */
export function validate(dateMode, startDateTime, endDateTime, repeatOption, repeatUntilDate, customDays){
	switch(dateMode){
		case 'Date':
			if (startDateTime == undefined || endDateTime == undefined){
				return "Please select the date for 'Date' mode."
			}

			if (repeatOption !== 'Does Not Repeat' && repeatUntilDate == undefined) {
				return "Please select the until date for the Repeat."
			}

			if(repeatOption !== 'Does Not Repeat' && repeatUntilDate.isBefore(endDateTime)) {
				return "Please ensure the repeat until date is afer the first occurrence date."
			}
			break;
		default:
			if (startDateTime == undefined ){
				return "Please select the start date."
			}

			if (endDateTime == undefined ){
				return "Please select the end date."
			}

			if(endDateTime.isBefore(startDateTime)) {
				return "Please ensure the end date time is afer the start date time."
			}
			break;
	}

	return '';
}