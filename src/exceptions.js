export const Exception = class extends Error {};
export const NotImplemented = class extends Exception {};
export const InvalidArgument = class extends Exception {};
export const InvalidState = class extends Exception {};
export const UnexpectedValue = class extends Exception {};

export default {
  Exception,
  NotImplemented,
  InvalidArgument,
  InvalidState,
  UnexpectedValue,
};
