import React from 'react';
require('dotenv').config();

function noop() {};

function getFirstDefined(a, b) {
	return a === undefined ? b : a;
}

function assert(assertion, errorMessage) {
	if ((process.env.NODE_ENV === 'development') && !assertion()) {
		throw new Error('ReactContextForm: ' + errorMessage);
	}
}

function isValidIndex(val) {
	switch (typeof val) {
		case 'number':
			return `${val}` === val.toFixed(0);
		case 'string':
			return val.match(/^[0-9]+$/);
		default:
			return false;
	}
}

function isValidName(val) {
	return typeof val === 'string' && /^[_a-z]/i.test(val);
}

class FormBaseContextValue {
	constructor(initialValue, onEvent, parentContext) {
		this._valueGetters = new Map();
		this.initialValue = initialValue;
		this.parentContext = parentContext;

		if (onEvent) {
			this.onEvent = onEvent;
		}

		this.getValue = this.getValue.bind(this);
		this.setValue = this.setValue.bind(this);
		this.registerFormValue = this.registerFormValue.bind(this);
		this.unregisterFormValue = this.unregisterFormValue.bind(this);
		this.triggerEvent = this.triggerEvent.bind(this);
	}

	getValue() {
		return this.initialValue;
	}

	setValue(value) {
		this.initialValue = value;
	}

	registerFormValue(nameOrIndex, getValue) {
		this._valueGetters.set(nameOrIndex, getValue);
	}

	unregisterFormValue(nameOrIndex, getValue) {
		this._valueGetters.delete(nameOrIndex);
	}

	triggerEvent(event) {
		const next = (_event = event) => this._triggerNext(_event);
		this.onEvent(event, this, next);
	}

	onEvent(event, context, next) {
		next(event, context);
	}

	_triggerNext(event) {
		if (this.parentContext) {
			this.parentContext.triggerEvent(event);
		}
	}
}

class FormObjectContextValue extends FormBaseContextValue {
	constructor(initialValue = {}, onEvent, parentContext) {
		super(initialValue, onEvent, parentContext);
	}

	getValue() {
		const result = {};
		this._valueGetters.forEach((getValue, name) => {
			result[name] = getValue();
		});
		return result;
	}

	registerFormValue(nameOrIndex, getValue) {
		assert(() => isValidName(nameOrIndex), `Invalid name for field ("${nameOrIndex}"). Name should be a string beginning with [_a-z]`);
		super.registerFormValue(nameOrIndex, getValue);
	}
}

class FormArrayContextValue extends FormBaseContextValue {
	constructor(initialValue = [], onEvent, parentContext) {
		super(initialValue, onEvent, parentContext);
	}

	getValue() {
		const result = [];
		this._valueGetters.forEach((getValue, index) => {
			result[index] = getValue();
		});
		return result;
	}

	registerFormValue(nameOrIndex, getValue) {
		assert(() => isValidIndex(nameOrIndex), `Invalid index for field ("${nameOrIndex}"). Index should be an integer number`);
		super.registerFormValue(nameOrIndex, getValue);
	}
}

export const FormContext = React.createContext(new FormBaseContextValue());

export function useFormComponentContext({ name, index, initialValue, getValue, setValue } = {}) {
	const nameOrIndex = getFirstDefined(name, index);
	const parentContext = React.useContext(FormContext);

	assert(() => parentContext, 'Trying to use form component without form context');

	React.useEffect(() => {
		if (nameOrIndex !== undefined) {
			if (setValue) {
				// if parent has an intial value for this component then use that, otherwise use one from props
				const value = getFirstDefined(parentContext.initialValue[nameOrIndex], initialValue);
				if (value !== undefined) {
					setValue(value);
				}
			}

			if (getValue) {
				// on mount, register getter with parent
				parentContext.registerFormValue(nameOrIndex, getValue);

				return () => {
					// on unmount, unregister getter with parent
					parentContext.unregisterFormValue(nameOrIndex, getValue);
				}
			}
		}
	});

	return parentContext;
}

function getInitialValue(initialValue, parentContext, nameOrIndex) {
	const parentContextValue = parentContext.initialValue && parentContext.initialValue[nameOrIndex];

	return getFirstDefined(parentContextValue, initialValue);
}

export function useFormObjectContext({ name, index, initialValue, onEvent }) {
	const nameOrIndex = getFirstDefined(name, index);
	const parentContext = React.useContext(FormContext);
	const _initialValue = getInitialValue(initialValue, parentContext, nameOrIndex);
	const thisContext = new FormObjectContextValue(_initialValue, onEvent, parentContext);

	if (nameOrIndex !== undefined) {
		React.useEffect(() => {
			parentContext.registerFormValue(nameOrIndex, thisContext.getValue);
			return () => parentContext.unregisterFormValue(nameOrIndex, thisContext.getValue);
		});
	}

	return thisContext;
}

export function useFormArrayContext({ name, index, initialValue, onEvent }) {
	const nameOrIndex = getFirstDefined(name, index);
	const parentContext = React.useContext(FormContext);
	const _initialValue = getInitialValue(initialValue, parentContext, nameOrIndex);
	const thisContext = new FormArrayContextValue(_initialValue, onEvent, parentContext);

	if (nameOrIndex !== undefined) {
		React.useEffect(() => {
			parentContext.registerFormValue(nameOrIndex, thisContext.getValue);
			return () => parentContext.unregisterFormValue(nameOrIndex, thisContext.getValue);
		});
	}

	return thisContext;
}
