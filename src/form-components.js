import React, { useEffect } from 'react';
import { FormContext, useFormContext, useNewFormContext } from './form-context';

const combineEventHandlers = (...handlers) => event => handlers.forEach(handler => handler && handler(event));

const firstDefined = (...args) => args.find(arg => arg !== undefined);

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

export function FormInput({ label, name, initialValue, onChange, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.value;
	const { triggerChange } = useFormContext({ name, getValue });
	const handleChange = combineEventHandlers(triggerChange, onChange);
	const labelText = firstDefined(label, name);

	if (initialValue) {
		useEffect(() => { ref.current.value = initialValue });
	}

	return (
		<label>
			<span>{labelText ? labelText + ':' : ""}</span>
			<input ref={ref} onChange={handleChange} {...otherProps} />
		</label>
	);
}

export function FormSubmit({children, onClick, ...otherProps}) {
	const { triggerSubmit } = useFormContext();
	const handleClick = combineEventHandlers(triggerSubmit, onClick);

	return (
		<button onClick={handleClick} {...otherProps}>{children}</button>
	);
}
