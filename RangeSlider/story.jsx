import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

import RangeSlider from './index.jsx';

const RootStyle = {
	position: 'relative',
	margin: '30px auto',
	width: "600px",
	height: "400px"
};

storiesOf('TimeLine Slider')
	.add('default integer data', () => {
		const Data = [1, 20];
		
		return <div style={RootStyle}>
			<RangeSlider domain={Data} start={2} end={5} width={600}/>
		</div>
	})
	.add('date data', () => {
		const Data = [new Date(2016, 11, 15), new Date(2016, 12, 10)];
		
		return <div style={RootStyle}>
			<RangeSlider domain={Data}
			             unit={"date"}
			             start={new Date(2016, 11, 20)}
			             end={new Date(2016, 11, 27)}
			             width={600}
			             onChange={(res) => {
				             //console.log(res);
			             }}
			/>
		</div>
	});

