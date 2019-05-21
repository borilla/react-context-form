import React from 'react';

const emptyObject = {};

function getFirstDefined(a, b) {
	return a === undefined ? b : a;
}

class FormBaseContextValue {
	constructor(onEvent, initialValue) {
		this._valueGetters = new Map();
		this.initialValue = initialValue;
		this.parentContext = null;

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
		const next = (_event = event) => this._triggerNext(event);
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
	constructor(onEvent, initialValue = {}) {
		super(onEvent, initialValue);
		this.getValue = this.getValue.bind(this);
	}

	getValue() {
		const result = {};
		this._valueGetters.forEach((getValue, name) => {
			result[name] = getValue();
		});
		return result;
	}
}

class FormArrayContextValue extends FormBaseContextValue {
	constructor(onEvent, initialValue = []) {
		super(onEvent, initialValue);
		this.getValue = this.getValue.bind(this);
	}

	getValue() {
		const result = [];
		this._valueGetters.forEach((getValue, index) => {
			result[index] = getValue();
		});
		return result;
	}
}

export const FormContext = React.createContext(new FormBaseContextValue());

export function useFormComponentContext({ name, index, initialValue, getValue, setValue } = {}) {
	const context = React.useContext(FormContext);

	React.useEffect(() => {
		const nameOrIndex = getFirstDefined(name, index);

		if (nameOrIndex !== undefined) {
			if (setValue) {
				const value = getFirstDefined(initialValue, context.initialValue[nameOrIndex]);
				if (value !== undefined) {
					setValue(value);
				}
			}

			context.registerFormValue(nameOrIndex, getValue);

			return () => {
				context.unregisterFormValue(nameOrIndex, getValue);
			}
		}
	});

	return context;
}

export function useFormObjectContext({ name, index, initialValue, onEvent }) {
	const thisContext = new FormObjectContextValue(onEvent, initialValue);
	const parentContext = useFormComponentContext({ name, index, initialValue, getValue: thisContext.getValue, setValue: thisContext.setValue });
	thisContext.parentContext = parentContext;

	return thisContext;
}

export function useFormArrayContext({ name, index, initialValue, onEvent }) {
	const thisContext = new FormArrayContextValue(onEvent, initialValue);
	const parentContext = useFormComponentContext({ name, index, initialValue, getValue: thisContext.getValue, setValue: thisContext.setValue });
	thisContext.parentContext = parentContext;

	return thisContext;
}
