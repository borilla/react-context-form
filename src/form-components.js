import React from 'react';
import { noop, FormContext, useFormComponentContext, useFormObjectContext, useFormArrayContext } from './form-context';

function combineEventHandlers(a, b) {
	if (!a) {
		return b || noop;
	}
	else if (!b) {
		return a;
	}
	return event => (a(event), b(event));
}

export function Section(props) {
	const context = useFormObjectContext(props);

	return (
		<section className="form">
			<FormContext.Provider value={context}>
				{props.children}
			</FormContext.Provider>
		</section>
	);
}

export function List(props) {
	const context = useFormArrayContext(props);

	return (
		<FormContext.Provider value={context}>
			{props.children}
		</FormContext.Provider>
	);
}

export function Input({ label, name, index, initialValue, onChange, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.value;
	const setValue = value => ref.current.value = value;
	const formContext = useFormComponentContext({ name, index, initialValue, getValue, setValue });
	const handleChange = combineEventHandlers(onChange, () => formContext.triggerEvent('change'));

	return (
		<label>
			<span>{label ? label + ':' : null}</span>
			<input {...otherProps} ref={ref} onChange={handleChange} />
		</label>
	);
}

export function Checkbox({ label, name, index, initialValue, onChange, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.checked;
	const setValue = value => ref.current.checked = value;
	const formContext = useFormComponentContext({ name, index, initialValue, getValue, setValue });
	const handleChange = combineEventHandlers(onChange, () => formContext.triggerEvent('change'));

	return (
		<label>
			<span>{label ? label + ':' : null}</span>
			<input {...otherProps} type="checkbox" ref={ref} onChange={handleChange} />
		</label>
	);
}

export function Select({ label, name, index, initialValue, onChange, children, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.value;
	const setValue = value => ref.current.value = value;
	const formContext = useFormComponentContext({ name, index, initialValue, getValue, setValue });
	const handleChange = combineEventHandlers(onChange, () => formContext.triggerEvent('change'));

	return (
		<label>
			<span>{label ? label + ':' : null}</span>
			<select {...otherProps} ref={ref} onChange={handleChange}>
				{children}
			</select>
		</label>
	);
}

export function Option({ children, ...otherProps }) {
	return <option {...otherProps}>{children}</option>;
}

export function Submit({children, onClick, ...otherProps}) {
	const formContext = useFormComponentContext();
	const handleClick = combineEventHandlers(onClick, () => formContext.triggerEvent('submit'));

	return (
		<button {...otherProps} onClick={handleClick}>{children}</button>
	);
}

export default {
	Section,
	List,
	Input,
	Checkbox,
	Select,
	Option,
	Submit
};
