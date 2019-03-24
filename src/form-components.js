import React from 'react';
import { FormContext, useFormContext, useNewFormContext } from './form-context';

export function FormSection(props) {
	const context = useNewFormContext(props);

	return (
		<section className="form">
			<FormContext.Provider value={context}>
				{props.children}
			</FormContext.Provider>
		</section>
	);
}

export function FormInput({ name, initialValue }) {
	const ref = React.createRef();
	const getValue = () => ref.current.value;
	const { triggerChange } = useFormContext({ name, getValue });

	useEffect(() => {
		initialValue && (ref.current.value = initialValue);
	})

	return (
		<label>
			<span>{name}:</span>
			<input ref={ref} onChange={triggerChange} />
		</label>
	);
}

export function FormSubmit(props) {
	const { triggerSubmit } = useFormContext();

	return (
		<button onClick={triggerSubmit}>{props.children}</button>
	);
}
