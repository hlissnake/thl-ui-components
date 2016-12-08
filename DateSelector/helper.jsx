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

	let momentString = moment(date).format('YYYYMMDD ');
	momentString += hour.length === 1 ? '0' + hour : hour;
	momentString += ':';
	momentString += minutes.length === 1 ? '0' + minutes : minutes;
	momentString += isAM ? ' am' : ' pm';

	return moment(momentString, 'YYYYMMDD hh:mm a');
}