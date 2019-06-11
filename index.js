import React from 'react';
import ReactDOM from 'react-dom';
import Form from './src/form-components';

const initialValue = {
	title: 'Ms',
	name: 'John',
	address: {
		lines: [
			'10 King Street',
			'Brisbane'
		],
		postalCode: '1234'
	}
};

function App(props) {
	const [state, setState] = React.useState(initialValue);

	function onEvent(event, { getValue }) {
		const newState = getValue();
		setState(newState);
		console.log(event, newState);
	}

	return (
		<Form.Section onEvent={onEvent} initialValue={state}>
			<Form.Select name="title" label="Title">
				<Form.Option>Mr</Form.Option>
				<Form.Option>Ms</Form.Option>
			</Form.Select>
			<Form.Input name="name" label="Name" />
			<Form.Input name="phone" label="Phone" />
			<Form.Input name="email" label="Email" />
			<Form.Section name="address">
				<Form.List name="lines">
					<Form.Input index="0" label="Address" />
					<Form.Input index="1" />
					<Form.Input index="2" />
				</Form.List>
				<Form.Input name="postalCode" label="Postal Code" />
			</Form.Section>
			<Form.Checkbox name="acceptTerms" label="Accept Terms" />
			<Form.Submit disabled={!state.acceptTerms}>Submit</Form.Submit>
		</Form.Section>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
