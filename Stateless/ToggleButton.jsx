import React, {Component} from 'react';
import Button from 'rebass/dist/Button';
import ButtonOutline from 'rebass/dist/ButtonOutline';

export default function ToggleButton(props) {
	if (props.selected) {
		return <Button {...props}/>
	} else {
		return <ButtonOutline {...props}/>
	}
}
