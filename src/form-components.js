import React from 'react';
import { FormContext, useFormComponentContext, useFormContainerContext } from './form-context';

const combineEventHandlers = (...handlers) => event => handlers.forEach(handler => handler && handler(event));

export function Section(props) {
	const context = useFormContainerContext(props);

	return (
		<section className="form">
			<FormContext.Provider value={context}>
				{props.children}
			</FormContext.Provider>
		</section>
	);
}

export function Input({ label, name, initialValue, onChange, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.value;
	const { triggerChange } = useFormComponentContext({ name, getValue });
	const handleChange = combineEventHandlers(triggerChange, onChange);

	React.useEffect(() => { initialValue && (ref.current.value = initialValue) });

	return (
		<label>
			<span>{label ? label + ':' : null}</span>
			<input {...otherProps} ref={ref} onChange={handleChange} />
		</label>
	);
}

export function Checkbox({ label, name, initialValue, onChange, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.checked;
	const { triggerChange } = useFormComponentContext({ name, getValue });
	const handleChange = combineEventHandlers(triggerChange, onChange);

	React.useEffect(() => { ref.current.checked = initialValue });

	return (
		<label>
			<span>{label ? label + ':' : null}</span>
			<input {...otherProps} type="checkbox" ref={ref} onChange={handleChange} />
		</label>
	);
}

export function Select({ label, name, initialValue, onChange, children, ...otherProps }) {
	const ref = React.createRef();
	const getValue = () => ref.current.value;
	const { triggerChange } = useFormComponentContext({ name, getValue });
	const handleChange = combineEventHandlers(triggerChange, onChange);

	React.useEffect(() => { ref.current.value = initialValue });

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
	const { triggerSubmit } = useFormComponentContext();
	const handleClick = combineEventHandlers(triggerSubmit, onClick);

	return (
		<button {...otherProps} onClick={handleClick}>{children}</button>
	);
}

export default {
	Section,
	Input,
	Checkbox,
	Select,
	Option,
	Submit
};
