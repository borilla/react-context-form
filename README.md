# react-context-form

[Experimental] form input using [`context`](https://reactjs.org/docs/context.html) to link the form components

## Purpose

Implementing forms in React causes some problems due to the state of forms being [ephemeral and local](https://jaredpalmer.com/formik/docs/overview#why-not-redux-form). The purpose of this project is to experiment with a simpler way of extracting structured form information within React. The project has the following goals:

### As small as possible

This repo is barely a library; it is really just a single file containing a set of hooks to assist with extracting form values and passing them to parent components through React's context. It also comes with a set of basic __form controls__ (Input, Select, Checkbox, Submit, etc) for user input and __structural components__ (Section and List) used to [structure the resulting form value](#data-structure-is-derived-from-component-heirarchy). You can choose to use any of these components as they are or build your own

### As unopinionated as possible

There are no limitations imposed on components that use the provided hooks or on the rest of your project. Most form controls simply have a `getValue` function to _get_ the current value. Additionally they can use `triggerEvent` to signal to containing structural components when some action should occur (eg "submit"). Values and events can be of any JavaScript types, allowing freedom to use them in your application as you wish

### Data structure is derived from component heirarchy

The data structure provided by the form is derived from the tree structure of form components, eg a structure such as

```html
  <Section name="person" />
    <Input name="firstName" />
    <Input name="surname" />
    <Section name="address">
      <List name="lines">
        <Input index="0" />
        <Input index="1" />
      </List>
      <Input name="zipCode" />
    </Section>
  </Section>
```

results in a javascript object like

```js
  person: {
    firstName: '',
    surname: '',
    address: {
      lines: [
        '',
        ''
      ],
      zipCode: ''
    }
  }
```

### Non-form components don't affect form behaviour

Form components can be freely mixed with any other components without affecting the resuting form value

## To try the demo

Clone the repo

```
git clone https://github.com/borilla/react-context-form.git
```

Switch to cloned directory and install required modules

```
cd react-context-form
npm install
```

Start parcel watcher and development server

```
npm start
```

Once the server has started you can view the [demo page](http://locahost:1234) in your browser
