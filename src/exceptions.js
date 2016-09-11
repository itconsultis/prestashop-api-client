export const Exception = class extends Error {};
export const NotImplemented = class extends Exception {};
export const InvalidArgument = class extends Exception {};
export const InvalidState = class extends Exception {};
export const UnexpectedValue = class extends Exception {};

export const HttpException = class extends Exception {

  /**
   * Override the Error constructor; allow the throwing context to specify
   * the HTTP status code.
   * @param {String} message
   * @param {String} file
   * @param {Number} line
   * @param {Number} status - HTTP status code; defaults to 500
   */
  constructor (...args) {
    let [message, file, line, status] = args;
    super(message, file, line);
    this.status = Number(status) || 500;
  }
};

export default {
  Exception,
  NotImplemented,
  InvalidArgument,
  InvalidState,
  UnexpectedValue,
  HttpException,
};
