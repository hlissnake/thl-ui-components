import React, {Component} from 'react';
import PanelHeader from 'rebass/dist/PanelHeader';

function WrappedPanelHeader({style = {}, theme = 'primary', ...props}, {rebass}) {
	if (props.inverted) {
		style.color = rebass.colors.black;
	}
	return <PanelHeader
		style={{
			...style,
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			borderBottomColor: (rebass.borderColors || rebass.colors)[theme] 
		}}
		theme={theme}
		{...props}
	/>;
};

WrappedPanelHeader.contextTypes = {
  rebass: React.PropTypes.object
};

export default WrappedPanelHeader;