import React  from 'react';
//import iCalGenerator from 'ical-generator';
import {ICalParser, VCalendar, VAlarm, VTodo, VEvent} from 'cozy-ical'

export default function addCal() {

	let cal = new VCalendar({
		organization: 'THL',
		title: 'Cosmos Calendar'
	});


	const startDate = new Date(2013, 5, 9, 15, 0, 0);
	const endDate = new Date(2013, 7, 10, 15, 0, 0);
	const vevent = new VEvent({
		stampDate: startDate,
		startDate: startDate,
		//endDate: endDate,
		description: "desc",
		location: "loc",
		uid: "3615"
	});

	vevent.


	cal.add(vevent);

	console.log("cal.toString(): ", cal.toString());

	new ICalParser().parseString(cal.toString(), function (err, cal) {
		console.log(cal.name);
		console.log(cal.getRawValue('PRODID'));
		console.log(cal.subComponents[0]);
		console.log(cal.subComponents[0].name);
		console.log(cal.subComponents[0].getRawValue('SUMMARY'));
	});

}