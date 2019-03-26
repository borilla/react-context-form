import React from 'react';
import ReactDOM from 'react-dom';
import { FormSection, FormInput, FormCheckbox, FormSubmit } from './src/form-components';

function App(props) {
	const [state, setState] = React.useState({ name: 'John', acceptTerms: false });

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
		<FormSection onChange={onChange} onSubmit={onSubmit}>
			<FormInput name="name" label="Name" initialValue={state.name} />
			<FormInput name="phone" label="Phone" />
			<FormInput name="email" label="Email" />
			<FormSection name="address">
				<FormInput name="line1" label="Address" />
				<FormInput name="line2" />
				<FormInput name="postalCode" label="Postal Code" />
			</FormSection>
			<FormCheckbox name="acceptTerms" label="Accept Terms" initialValue={state.acceptTerms} />
			<FormSubmit disabled={!state.acceptTerms}>Submit</FormSubmit>
		</FormSection>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
