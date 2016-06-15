import React from 'react';
import inputValidityError from './helpers/inputValidityError';

export default class Input extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    name: React.PropTypes.string.isRequired,
    pattern: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
    autofocus: React.PropTypes.bool,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    offValue: React.PropTypes.any,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onFocus: React.PropTypes.func,
  };

  static contextTypes = {
    getFormModelValue: React.PropTypes.func.isRequired,
    registerFormControl: React.PropTypes.func.isRequired,
    unregisterFormControl: React.PropTypes.func.isRequired,
  };

  componentDidMount () {
    this.context.registerFormControl(this);
    if (this.props.autofocus) {
      this.refs.input.focus();
    }
  }

  componentWillUnmount () {
    this.context.unregisterFormControl(this);
  }

  getModelValue () {
    return this.context.getFormModelValue(this.props.name);
  }

  getValue () {
    if (this.isRadio() || this.isCheckbox()) {
      if (this.refs.input.checked) {
        return this.getCheckedValue();
      } else {
        if (this.isRadio()) {
          return this.getUnselectedValue();
        } else {
          return this.getUncheckedValue();
        }
      }
    } else {
      return this.refs.input.value;
    }
  }

  getCheckedValue () {
    return this.props.value || true;
  }

  getUncheckedValue () {
    return this.props.offValue || false;
  }

  getUnselectedValue () {
    return this.props.offValue || undefined;
  }

  getValidationError () {
    return inputValidityError(this.refs.input);
  }

  render () {
    if (this.isCheckbox() || this.isRadio()) {
      return this.renderRadioCheckbox();
    }
    return this.renderTextInput();
  }

  renderTextInput () {
    return (
      <input
        className={ this.props.className }
        defaultValue={ this.getModelValue() }
        id={ this.props.id }
        max={ this.props.max }
        min={ this.props.min }
        name={ this.props.name }
        onBlur={ this.props.onBlur }
        onChange={ this.props.onChange }
        onClick={ this.props.onClick }
        onFocus={ this.props.onFocus }
        pattern={ this.props.pattern }
        placeholder={ this.props.placeholder }
        ref="input"
        required={ this.props.required }
        type={ this.props.type }
      />
    );
  }

  renderRadioCheckbox () {
    const checked = this.getModelValue() === this.getCheckedValue();
    return (
      <input
        className={ this.props.className }
        defaultChecked={ checked }
        id={ this.props.id }
        name={ this.props.name }
        onBlur={ this.props.onBlur }
        onChange={ this.props.onChange }
        onClick={ this.props.onClick }
        onFocus={ this.props.onFocus }
        placeholder={ this.props.placeholder }
        ref="input"
        type={ this.props.type }
        value={ this.props.value }
      />
    );
  }

  isCheckbox () {
    return this.props.type.toLowerCase() === 'checkbox';
  }

  isRadio () {
    return this.props.type.toLowerCase() === 'radio';
  }
}
