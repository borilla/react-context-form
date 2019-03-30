import React from 'react';

const firstDefined = (a, b) => a === undefined ? b : a;

// TODO: Make into a proper class?
function FormContextValue(initialValue = {}) {
	const _valueGetters = new Map();
	const _eventListeners = new Map();

	function getValue() {
		const result = {};
		_valueGetters.forEach((getValue, name) => {
			result[name] = getValue();
		});
		return result;
	}

	function triggerEvent(eventName) {
		getEventListeners(eventName).forEach(listener => {
			listener(contextValue);
		});
	}

	function addNewEventType(eventName) {
		const listeners = new Set();
		_eventListeners.set(eventName, listeners);
		return listeners;
	}

	function getEventListeners(eventName) {
		return _eventListeners.get(eventName) || addNewEventType(eventName);
	}

	const contextValue = {
		registerFormValue: (name, getValue) => { name && getValue && _valueGetters.set(name, getValue) },
		unregisterFormValue: (name, getValue) => { name && getValue && _valueGetters.delete(name) },
		addEventListener: (eventName, listener) => { listener && getEventListeners(eventName).add(listener) },
		removeEventListener: (eventName, listener) => { listener && getEventListeners(eventName).delete(listener) },
		getValue,
		initialValue,
		triggerEvent,
		triggerChange: () => triggerEvent('change'),
		triggerSubmit: () => triggerEvent('submit')
	};

	return contextValue;
}

export const FormContext = React.createContext(new FormContextValue());

export function useFormComponentContext({ name, initialValue, getValue, setValue } = {}) {
	const context = React.useContext(FormContext);

	React.useEffect(() => {
		if (setValue) {
			const value = firstDefined(initialValue, context.initialValue[name]);
			if (value !== undefined) {
				setValue(value);
			}
		}

		context.registerFormValue(name, getValue);

		return () => {
			context.unregisterFormValue(name, getValue);
		}
	});

	return context;
}

export function useFormContainerContext({ name, initialValue, onChange, onSubmit }) {
	const thisContext = new FormContextValue();
	const parentContext = useFormComponentContext({ name, getValue: thisContext.getValue });
	thisContext.initialValue = initialValue || parentContext.initialValue[name] || {};

	React.useEffect(() => {
		thisContext.addEventListener('change', onChange);
		thisContext.addEventListener('change', parentContext.triggerChange);
		thisContext.addEventListener('submit', onSubmit);
		thisContext.addEventListener('submit', parentContext.triggerSubmit);

		return () => {
			thisContext.removeEventListener('change', onChange);
			thisContext.removeEventListener('change', parentContext.triggerChange);
			thisContext.removeEventListener('submit', onSubmit);
			thisContext.removeEventListener('submit', parentContext.triggerSubmit);
		}
	});

	return thisContext;
}
