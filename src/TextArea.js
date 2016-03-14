import React from 'react';
import _ from 'lodash';
import inputValidityError from './helpers/inputValidityError';

export default class TextArea extends React.Component {
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
    value: React.PropTypes.any,
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

  getId () {
    if (this.props.id) {
      return this.props.id;
    }
    if (!this._id) {
      this._id = _.uniqueId('input');
    }
    return this._id;
  }

  getModelValue () {
    return this.context.getFormModelValue(this.props.name);
  }

  getValue () {
    return this.refs.input.value;
  }

  getValidationError () {
    return inputValidityError(this.refs.input);
  }

  render () {
    return (
      <textarea
        className={ this.props.className }
        defaultValue={ this.getModelValue() }
        id={ this.props.id }
        max={ this.props.max }
        min={ this.props.min }
        name={ this.props.name }
        pattern={ this.props.pattern }
        placeholder={ this.props.placeholder }
        required={ this.props.required }
        onBlur={ this.props.onBlur }
        onChange={ this.props.onChange }
        onClick={ this.props.onClick }
        onFocus={ this.props.onFocus }
        ref="input"
      />
    );
  }
}
