import React from 'react';

export default class SubmitButton extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    type: React.PropTypes.string,
  };

  static contextTypes = {
    registerFormButton: React.PropTypes.func.isRequired,
    unregisterFormButton: React.PropTypes.func.isRequired,
  };

  componentDidMount () {
    this.context.registerFormButton(this);
  }

  componentWillUnmount () {
    this.context.unregisterFormButton(this);
  }

  setFormSubmitting (status) {
    this.setState({
      formSubmitting: status,
    });
  }

  render () {
    return (
      <button
        type={ this.props.type || 'submit' }
        className={ this.props.className }
        id={ this.props.id }
        name={ this.props.name }
        onClick={ this.props.onClick }
        onFocus={ this.props.onFocus }
        disabled={ this.state && this.state.formSubmitting }
        >
        { this.props.children }
      </button>

    );
  }
}
