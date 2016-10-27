import React from 'react'
import Base from 'rebass/dist/Base'
import config from 'rebass/dist/config'

/**
 * Table element with simplified props
 */

let contextTypes = {
  rebass: React.PropTypes.object
}

export const Table = (props, {rebass}) => {
	const { fontSizes, scale, borderColor } = { ...config, ...rebass };
	return <Base
		{...props}
		className="Table"
		tagName="table"
		baseStyle={{
		  maxWidth: '100%',
		  overflowX: 'scroll',
		  marginBottom: scale[2],
		  borderColor,
		  fontSize: fontSizes[5],
		  lineHeight: 1.25,
		  borderCollapse: 'separate',
		  borderSpacing: 0,
		  width: '100%'
		}}
	/>;
};
Table.contextTypes = contextTypes;

export const Thead = (props, {rebass}) => {
	return <Base
		{...props}
		tagName="thead"
		className="Table.THead"
		baseStyle={{}}
	/>;
};
Thead.contextTypes = contextTypes;

export const Tbody = (props, {rebass}) => {
	return <Base
		{...props}
		tagName="tbody"
		className="Table.THead"
		baseStyle={{}}
	/>;
};
Tbody.contextTypes = contextTypes;

export const TR = (props, {rebass}) => {
	return <Base
		{...props}
		tagName="tr"
		className="Table.TR"
		baseStyle={{}}
	/>;
};
TR.contextTypes = contextTypes;

export const TH = (props, {rebass}) => {
	const { scale } = { ...config, ...rebass };
	return <Base
		{...props}
		tagName="th"
		className="Table.TH"
		baseStyle={{
			textAlign: 'left',
			verticalAlign: 'bottom',
			padding: scale[1],
			paddingLeft: 0,
			borderBottomStyle: 'solid',
			borderBottomWidth: 2,
			borderColor: 'inherit'
		}}
	/>;
};
TH.contextTypes = contextTypes;

export const TD = (props, {rebass}) => {
	const { scale } = { ...config, ...rebass };
	return <Base
		{...props}
		tagName="td"
		className="Table.TD"
		baseStyle={{
			padding: scale[1],
			paddingLeft: 0,
			borderBottomStyle: 'solid',
			borderBottomWidth: 1,
			borderColor: 'inherit'
		}}
	/>;
};
TD.contextTypes = contextTypes;

export default {Table,Tbody,Thead,TR,TD,TH};
