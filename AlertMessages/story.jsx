import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {StyleRoot} from 'radium';
import RebassThemes from '../RebassThemes';
import AlertMessages from './';

class AlertMessagesWrapper extends React.Component {
	constructor(){
		super();
		this.state = {
			messages: []
		};
	}
	
	render() {
		return <div>
			<button onClick={() => this.setState({messages: this.state.messages.concat([{key: new Date().getTime(), children: 'Test Message', theme: 'primary'}])})}>Add Message</button>
			<AlertMessages messages={this.state.messages} clear={key => {
				this.setState({messages: this.state.messages.reduce((current, message) => {
					if (message.key !== key) {
						current.push(message);
					}
					return current;
				}, [])});
			}}/>
		</div>;
	}
}

storiesOf('AlertMessages', module)
.addDecorator((story) => <StyleRoot><RebassThemes theme={{colors: {primary: 'green', error: 'red', warning: 'orange', white: 'white'}}}>{story()}</RebassThemes></StyleRoot>)
.add('default', () => (
	<AlertMessagesWrapper/>
));
