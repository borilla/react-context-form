import React from 'react';
import ReactDOM from 'react-dom';
import { FormSection, FormInput, FormSubmit } from './src/form-components';

function App(props) {
	const onChange = getValue => console.log('Change:', getValue());
	const onSubmit = getValue => console.log('Submit:', getValue());

	return (
		<FormSection onChange={onChange} onSubmit={onSubmit}>
			<FormInput name="one" />
			<FormInput name="two" />
			<FormInput name="three" initialValue="hello" />
			<FormSection name="inner-form">
				<FormInput name="four" />
				<FormInput name="five" />
			</FormSection>
			<FormSubmit data-id="submit-button" onClick={() => console.log('Submit clicked')}>Submit</FormSubmit>
		</FormSection>
	);
}

ReactDOM.render(<App />, document.getElementById('app'));
