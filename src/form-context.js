import React from 'react';

// TODO: Make into a proper class?
function FormContextValue() {
	const _valueGetters = new Map();
	const _changeListeners = new Set();
	const _submitListeners = new Set();

	function getValue() {
		const result = {};
		_valueGetters.forEach((getValue, name) => {
			result[name] = getValue();
		});
		return result;
	}

	function triggerListeners(listeners) {
		listeners.forEach(listener => {
			listener(getValue);
		});
	}

	function triggerChange() {
		triggerListeners(_changeListeners);
	}

	function triggerSubmit() {
		triggerListeners(_submitListeners);
	}

	return {
		registerFormValue: (name, getValue) => { name && getValue && _valueGetters.set(name, getValue) },
		unregisterFormValue: (name, getValue) => { name && getValue && _valueGetters.delete(name) },
		registerChangeListener: listener => { listener && _changeListeners.add(listener) },
		unegisterChangeListener: listener => { listener && _changeListeners.delete(listener) },
		registerSubmitListener: listener => { listener && _submitListeners.add(listener) },
		unegisterSubmitListener: listener => { listener && _submitListeners.delete(listener) },
		getValue,
		triggerChange,
		triggerSubmit
	};
}

export const FormContext = React.createContext(new FormContextValue());

export function useFormContext({ name, getValue, onChange, onSubmit } = {}) {
	const context = React.useContext(FormContext);

	React.useEffect(() => {
		context.registerFormValue(name, getValue);
		context.registerChangeListener(onChange);
		context.registerSubmitListener(onSubmit);

		return () => {
			context.unregisterFormValue(name, getValue);
			context.unregisterChangeListener(onChange);
			context.unregisterSubmitListener(onSubmit);
		}
	});

	return context;
}

export function useNewFormContext({ name, onChange, onSubmit }) {
	const myContext = new FormContextValue();
	const parentContext = useFormContext({
		name,
		getValue: myContext.getValue
	});

	React.useEffect(() => {
		myContext.registerChangeListener(onChange);
		myContext.registerChangeListener(parentContext.triggerChange);
		myContext.registerSubmitListener(onSubmit);
		myContext.registerSubmitListener(parentContext.triggerSubmit);

		return () => {
			myContext.unregisterChangeListener(onChange);
			myContext.unregisterChangeListener(parentContext.triggerChange);
			myContext.unregisterSubmitListener(onSubmit);
			myContext.unregisterSubmitListener(parentContext.triggerSubmit);
		}
	});

	return myContext;
}
