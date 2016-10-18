import React, {Component} from 'react';
import Button from './Button';
import ButtonOutline from './ButtonOutline';

export default function ToggleButton(props) {
	if (props.selected) {
		return <Button {...props}/>
	} else {
		return <ButtonOutline {...props}/>
	}
}
