import React from 'react';
import _ from 'lodash';

export default class Form extends React.Component {

  static propTypes = {
    action: React.PropTypes.func,
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    name: React.PropTypes.string,
    model: React.PropTypes.object,
    onCatch: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onSuccess: React.PropTypes.func,
    onValidationFail: React.PropTypes.func,
    validateForm: React.PropTypes.func,
    showValidationErrors: React.PropTypes.bool,
    waitIndicator: React.PropTypes.node,
  };

  static childContextTypes = {
    formModel: React.PropTypes.object,
    getFormModelValue: React.PropTypes.func,
    registerFormButton: React.PropTypes.func,
    registerFormInput: React.PropTypes.func,
    unregisterFormButton: React.PropTypes.func,
    unregisterFormInput: React.PropTypes.func,
  };

  constructor (props, context) {
    super(props, context);
    this.getFormModelValue = ::this.getFormModelValue;
    this.onInputRegistration = ::this.onInputRegistration;
    this.onInputUnregistration = ::this.onInputUnregistration;
    this.onButtonRegistration = ::this.onButtonRegistration;
    this.onButtonUnregistration = ::this.onButtonUnregistration;
    this.registeredInputs = [];
    this.registeredButtons = [];
  }

  getChildContext () {
    return {
      formModel: this.props.model,
      getFormModelValue: this.getFormModelValue,
      registerFormButton: this.onButtonRegistration,
      registerFormInput: this.onInputRegistration,
      unregisterFormButton: this.onButtonUnregistration,
      unregisterFormInput: this.onInputUnregistration,
    };
  }

  onSubmit (evt) {
    evt.preventDefault();
    if (this.state && this.state.isSubmitting) {
      return false;
    }

    const modelValue = this.gatherInputValues();
    const validationErrors = this.getValidationErrors(modelValue);
    if (validationErrors.length) {
      if (this.props.onValidationFail) {
        this.props.onValidationFail(validationErrors);
      }
      this.setState({
        validationErrors,
      });
      return undefined;
    }

    this.setState({
      validationErrors: undefined,
    }, () => {
      let shouldContinue = true;
      if (this.props.onSubmit) {
        shouldContinue = this.props.onSubmit(modelValue);
      }
      if (shouldContinue === false) {
        return undefined;
      }
      this.processFormAction(modelValue);
    });
  }

  onInputRegistration (input) {
    if (this.registeredInputs.indexOf(input) === -1) {
      this.registeredInputs.push(input);
    }
  }

  onInputUnregistration (input) {
    const index = this.registeredInputs.indexOf(input);
    if (index !== -1) {
      this.registeredInputs.splice(index, 1);
    }
  }

  onButtonRegistration (button) {
    if (this.registeredButtons.indexOf(button) === -1) {
      this.registeredButtons.push(button);
    }
  }

  onButtonUnregistration (button) {
    const index = this.registeredButtons.indexOf(button);
    if (index !== -1) {
      this.registeredButtons.splice(button, 1);
    }
  }

  getFormModelValue (name) {
    return _.get(this.props.model || {}, name);
  }

  getFormValidationErrors (modelValue) {
    if (this.props.validateForm) {
      const errors = this.props.validateForm(modelValue, this);
      if (!errors) {
        return [];
      }
      return errors;
    } else {
      return [];
    }
  }

  getValidationErrors (modelValue) {
    return _.chain(this.registeredInputs).map((inputComponent) => {
      if (!inputComponent.getValidationError) {
        return undefined;
      }
      const errorMessage = inputComponent.getValidationError();
      if (errorMessage) {
        /* eslint-disable no-console */
        console.warn('Validation error', inputComponent, errorMessage);
        return {
          errorMessage,
          inputComponent,
        };
      }
      return undefined;
    }).concat(this.getFormValidationErrors(modelValue)).compact().value();
  }

  render () {
    return (
      <form onSubmit={ ::this.onSubmit } className={ this.props.className } name={ this.props.name }>
        { this.renderValidationErrors() }
        { this.props.children }
        { this.renderWaitIndicator() }
      </form>
    );
  }

  renderValidationErrors () {
    if (this.props.showValidationErrors && this.state && this.state.validationErrors) {
      console.log(this.state.validationErrors);
      const messages = this.state.validationErrors.map((validation, i) => {
        return <li key={ i } className="form__validation-errors__message">{ validation.errorMessage }</li>;
      });
      return (
        <ul className="form__validation-errors">
          { messages }
        </ul>
      );
    }
  }

  renderWaitIndicator () {
    if (this.state && this.state.isSubmitting && this.props.waitIndicator) {
      return <div className="form__wait-indictator">{ this.props.waitIndicator }</div>;
    }
  }

  gatherInputValues () {
    return _.reduce(this.registeredInputs, (model, inputComponent) => {
      const value = inputComponent.getValue();
      if (value !== undefined) {
        _.set(model, inputComponent.props.name, value);
      }
      return model;
    }, _.cloneDeep(this.props.model || {}));
  }

  processFormAction (modelValue) {
    if (this.props.action) {
      const response = this.props.action(modelValue);
      if (response && response.then && _.isFunction(response.then)) { // its a promise
        return this.processFormActionPromise(response);
      } else {
        if (response) { // true false response
          if (this.props.onSuccess) {
            this.props.onSuccess(modelValue);
          }
        } else {
          if (this.props.onCatch) {
            this.props.onCatch(modelValue);
          }
        }
      }
    }
  }

  processFormActionPromise (promise) {
    this.startSubmission();
    promise.then((model) => {
      this.endSubmission(() => {
        if (this.props.onSuccess) {
          this.props.onSuccess(model);
        }
      });
    }).catch((response) => {
      this.endSubmission(() => {
        if (this.props.onCatch) {
          this.props.onCatch(response);
        }
      });
    });
  }

  startSubmission () {
    this.setState({
      isSubmitting: true,
      errorMessage: false,
    });
    this.registeredButtons.forEach((button) => {
      if (button.setFormSubmitting) {
        button.setFormSubmitting(true);
      }
    });
  }

  endSubmission (cb) {
    this.setState({
      isSubmitting: false,
      errorMessage: false,
    }, cb);
    this.registeredButtons.forEach((button) => {
      if (button.setFormSubmitting) {
        button.setFormSubmitting(false);
      }
    });
  }

}
