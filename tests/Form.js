import expect from 'expect';
import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import Form from '../src/Form';

describe('Form', function () {
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
      unregisterFormControl: React.PropTypes.func.isRequired,
      getFormStatus: React.PropTypes.func.isRequired,
      getFormModelValue: React.PropTypes.func.isRequired,
    };
    this.Component = Component;
  });
  it('provide registration functions', function () {
    const Component = this.Component;
    renderIntoDocument(
      <Form>
        <Component />
      </Form>
    );
    expect(context.registerFormControl).toExist();
  });
  it('provide unregistration functions', function () {
    const Component = this.Component;
    renderIntoDocument(
      <Form>
        <Component />
      </Form>
    );
    expect(context.unregisterFormControl).toExist();
  });

  it('provide getFormStatus func', function () {
    const Component = this.Component;
    renderIntoDocument(
      <Form>
        <Component />
      </Form>
    );
    expect(context.getFormStatus).toExist();
    expect(context.getFormStatus().isSubmitting).toEqual(false);
  });

  it('#startSubmission should update formStatus object', function () {
    const Component = this.Component;
    const form = renderIntoDocument(
      <Form>
        <Component />
      </Form>
    );
    form.startSubmission();
    expect(context.getFormStatus().isSubmitting).toEqual(true);
  });

  it('#getFormModelValue can traverse complex items', function () {
    const Component = this.Component;
    const model = {
      hello: [
        null,
        {
          there: {
            friend: 1,
          },
        },
      ],
    };
    const form = renderIntoDocument(
      <Form model={ model }>
        <Component />
      </Form>
    );
    form.startSubmission();
    expect(context.getFormModelValue('hello[1].there')).toEqual(model.hello[1].there);
  });
});
