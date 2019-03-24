import React from 'react';
import ReactDOM from 'react-dom';
import { FormSection, FormInput, FormSubmit } from './src/form-components';

function App(props) {
	const onChange = getValue => console.log('Change:', getValue());
	const onSubmit = getValue => console.log('Submit:', getValue());

	return (
		<FormSection onChange={onChange} onSubmit={onSubmit}>
			<FormInput name="name" label="Name" />
			<FormInput name="phone" label="Phone" />
			<FormInput name="email" label="Email" />
			<FormSection name="address">
				<FormInput name="line-1" label="Address" />
				<FormInput name="line-2" label="" />
				<FormInput name="postal-code" label="Postal Code" />
			</FormSection>
			<FormSubmit data-id="submit-button" onClick={() => console.log('Submit clicked')}>Submit</FormSubmit>
		</FormSection>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
