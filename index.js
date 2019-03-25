import React from 'react';
import ReactDOM from 'react-dom';
import { FormSection, FormInput, FormCheckbox, FormSubmit } from './src/form-components';

function App(props) {
	const [formValue, setFormValue] = React.useState({ name: 'John', acceptTerms: false });

	function onChange(getValue) {
		const formValue = getValue();
		setFormValue(formValue);
		console.log('Change:', formValue);
	}

	function onSubmit(getValue) {
		const formValue = getValue();
		setFormValue(formValue);
		console.log('Submit:', formValue);
	}

	return (
		<FormSection onChange={onChange} onSubmit={onSubmit}>
			<FormInput name="name" label="Name" initialValue={formValue.name} />
			<FormInput name="phone" label="Phone" />
			<FormInput name="email" label="Email" />
			<FormSection name="address">
				<FormInput name="line1" label="Address" />
				<FormInput name="line2" />
				<FormInput name="postalCode" label="Postal Code" />
			</FormSection>
			<FormCheckbox name="acceptTerms" label="Accept Terms" initialValue={formValue.acceptTerms} />
			<FormSubmit disabled={!formValue.acceptTerms}>Submit</FormSubmit>
		</FormSection>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
