export default function inputValidityError (input) {
  const validityState = input.validity;
  if (validityState.customError) {
    return validityState.customError;
  } else if (validityState.rangeOverflow) {
    return `Value is too large. Maximujm is ${input.max}.`;
  } else if (validityState.rangeUnderflow) {
    return `Value is too small. Minimum is ${input.min}.`;
  } else if (validityState.tooLong) {
    return `Value is too long. Max character length is ${input.maxLength}.`;
  } else if (validityState.valueMissing) {
    return 'This input is required to be filled out.';
  } else if (!validityState.valid) {
    return 'We cannot understand the value of this input.';
  }
  return undefined;
}
