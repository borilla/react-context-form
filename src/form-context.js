import React from 'react';

function getFirstDefined(a, b) {
	return a === undefined ? b : a;
}

class FormBaseContextValue {
	constructor(onEvent, initialValue, parentContext) {
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
	constructor(onEvent, initialValue = {}, parentContext) {
		super(onEvent, initialValue, parentContext);
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
	constructor(onEvent, initialValue = [], parentContext) {
		super(onEvent, initialValue, parentContext);
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
	const nameOrIndex = getFirstDefined(name, index);
	const parentContext = React.useContext(FormContext);

	if (!parentContext) {
		throw new Error('ReactFormContext: Trying to use form component without form context');
	}

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
	if (initialValue !== undefined) {
		return initialValue;
	}
	// TODO: JA: Can we have a situation where we have no parentContext?
	if (!parentContext) {
		return undefined;
	}
	return parentContext.initialValue[nameOrIndex];
}

export function useFormObjectContext(props) {
	const nameOrIndex = getFirstDefined(props.name, props.index);
	const parentContext = React.useContext(FormContext);
	const initialValue = getInitialValue(props.initialValue, parentContext, nameOrIndex);
	const thisContext = new FormObjectContextValue(props.onEvent, initialValue, parentContext);

	if (parentContext && nameOrIndex !== undefined) {
		React.useEffect(() => {
			parentContext.registerFormValue(nameOrIndex, thisContext.getValue);
			return () => parentContext.unregisterFormValue(nameOrIndex, thisContext.getValue);
		});
	}

	return thisContext;
}

export function useFormArrayContext(props) {
	const nameOrIndex = getFirstDefined(props.name, props.index);
	const parentContext = React.useContext(FormContext);
	const initialValue = getInitialValue(props.initialValue, parentContext, nameOrIndex);
	const thisContext = new FormArrayContextValue(props.onEvent, initialValue, parentContext);

	if (parentContext && nameOrIndex !== undefined) {
		React.useEffect(() => {
			parentContext.registerFormValue(nameOrIndex, thisContext.getValue);
			return () => parentContext.unregisterFormValue(nameOrIndex, thisContext.getValue);
		});
	}

	return thisContext;
}
