import expect from 'expect';
import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import Form from '../src/Form';

describe('#Form', function () {
  let context;
  beforeEach(function () {
    class Component extends React.Component {
      constructor (props, ctx) {
        super(props, ctx);
        context = ctx;
      }

      render () {
        return null;
      }
    }

    Component.contextTypes = {
      registerFormControl: React.PropTypes.func.isRequired,
    };
    this.Component = Component;
  });
  it('should provide registration functions', function () {
    const Component = this.Component;
    renderIntoDocument(
      <Form>
        <Component />
      </Form>
    );
    expect(context.registerFormControl).toExist();
  });
});
