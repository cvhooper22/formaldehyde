[![Build Status](https://travis-ci.org/inlineblock/formaldehyde.svg)](https://travis-ci.org/inlineblock/formaldehyde)
# Formaldehyde

## What

React form creation/validation/population. Supports top-down rendering with input population. Keeps the immutable data structures mindset.


## Why

We needed something elegant for creating forms and inputs that self populate, require no state, and at a input AND form levels, have easy use for validation.

## How

##### Install
```bash
$ npm i formaldehyde
```

```js
# CreateUserForm.js
import React from 'react';
import { Form, Input, SubmitButton } from 'formaldehyde';

export default class CreateUserForm extends React.Component {
  onSuccess (result) {
    // if there is no action on the Form or if it returns nothing, this gets called immiediately
    // otherwise if the action returns a promise, it will wait for it to finish
    // the result is the result of the promise.
    this.props.navigate(result.id);
  }

  onFormValidate (model) { // this function returns an array of errors.
    const errors = [];
    if (!model.agree) {
      errors.push('You need to agree to the terms');
    }
    return errors;
  }

  render () {
    return (
      <Form action={ this.props.action } onSuccess={ ::this.onSuccess } validateForm={ ::this.onFormValidate } model={ {} } showValidationErrors>
        <p>
          <Input type="text" name="full_name" placeholder="Full Name" required />
        </p>
        <p>
          <Input type="checkbox" name="agree" /> 
        </p>
        <p>
          <SubmitButton className="button">Create User</SubmitButton>
        </p>
      </Form>
    );
  }
}
```
