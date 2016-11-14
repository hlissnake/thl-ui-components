import React, {Component} from 'react';
import ButtonCircle from 'rebass/dist/ButtonCircle';

function WrappedButtonCircle({style = {}, theme = 'primary', ...props}, {rebass}) {
	return <ButtonCircle
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

WrappedButtonCircle.contextTypes = {
  rebass: React.PropTypes.object
};

export default WrappedButtonCircle;
