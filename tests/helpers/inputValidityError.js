import expect from 'expect';
import inputValidityError from '../../src/helpers/inputValidityError';

describe('#inputValidityError', function () {
  beforeEach(function () {
    this.input = document.createElement('INPUT');
    this.input.name = 'Name';
  });
  it('should provide empty with no validation', function () {
    expect(inputValidityError(this.input)).toNotExist();
  });
  it('should provide error when required', function () {
    this.input.required = true;
    expect(inputValidityError(this.input)).toExist();
  });
});
