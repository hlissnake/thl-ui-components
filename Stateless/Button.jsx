import React, {Component} from 'react';
import Button from 'rebass/dist/Button';

function WrappedButton({style = {}, theme = 'primary', ...props}, {rebass}) {
	return <Button
		style={{
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: rebass.colors[theme], 
			...style
		}}
		theme={theme}
		{...props}
	/>;
};

WrappedButton.contextTypes = {
  rebass: React.PropTypes.object
};

export default WrappedButton;
