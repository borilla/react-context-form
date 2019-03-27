import React from 'react';
import ReactDOM from 'react-dom';
import Form from './src/form-components';

function App(props) {
	const [state, setState] = React.useState({ title: 'Ms', name: 'John', acceptTerms: false });

	function onChange({ getValue }) {
		const newState = getValue();
		setState(newState);
		console.log('Change:', newState);
	}

	function onSubmit({ getValue }) {
		const newState = getValue();
		setState(newState);
		console.log('Submit:', newState);
	}

	return (
		<Form.Section onChange={onChange} onSubmit={onSubmit}>
			<Form.Select name="title" label="Title" initialValue={state.title}>
				<Form.Option>Mr</Form.Option>
				<Form.Option>Ms</Form.Option>
			</Form.Select>
			<Form.Input name="name" label="Name" initialValue={state.name} />
			<Form.Input name="phone" label="Phone" />
			<Form.Input name="email" label="Email" />
			<Form.Section name="address">
				<Form.Input name="line1" label="Address" />
				<Form.Input name="line2" />
				<Form.Input name="postalCode" label="Postal Code" />
			</Form.Section>
			<Form.Checkbox name="acceptTerms" label="Accept Terms" initialValue={state.acceptTerms} />
			<Form.Submit disabled={!state.acceptTerms}>Submit</Form.Submit>
		</Form.Section>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
