import moment from 'moment';

/*
	dateTime is a moment string like '2016-12-12T23:00:00.000Z'
 */
export function convertTimeFromMomentObj(dateTime){

	if (dateTime === undefined) {
		return null;
	}

	return {
		hour: moment(dateTime).format('h'),
		minutes: moment(dateTime).format('mm'),
		isAM: moment(dateTime).format('a') === 'am',
	};
}

export function convertDateTimeToMomentObj(date, hour, minutes, isAM) {

	if (date == undefined || hour == undefined || minutes == undefined || isAM == undefined) {
		return null;
	}

	let momentString = moment(date).format('YYYYMMDD ');
	momentString += hour.length === 1 ? '0' + hour : hour;
	momentString += ':';
	momentString += minutes.length === 1 ? '0' + minutes : minutes;
	momentString += isAM ? ' am' : ' pm';

	return moment(momentString, 'YYYYMMDD hh:mm a');
}


/*
	The return is the error message
 */
export function validateOutput(data){
	switch(data.dateMode){
		case 'Date':
			if (data.startDateTime == undefined || data.endDateTime == undefined){
				return "Please select the date for 'Date' mode."
			}

			if (data.repeatOption !== 'Does Not Repeat' && data.repeatUntil == undefined) {
				return "Please select the until date for the Repeat."
			}

			if(data.repeatOption !== 'Does Not Repeat' && data.repeatUntil.isBefore(data.endDateTime)) {
				return "Please ensure the repeat until date is afer the first occurrence date."
			}
			break;
		default:
			if (data.startDateTime == undefined ){
				return "Please select the start date."
			}

			if (data.endDateTime == undefined ){
				return "Please select the end date."
			}

			if(data.endDateTime.isBefore(data.startDateTime)) {
				return "Please ensure the end date time is afer the start date time."
			}
			break;
	}

	return '';
}