// @flow

import ExtendableError from 'es6-error';
import {
  createDebug
} from './factories';
import type {
  ResponseType,
  ValidationErrorType
} from './types';

const debug = createDebug('errors');

export class PayonError extends ExtendableError {

}

export class PayonRemoteError extends PayonError {
  code: string;
  message: string;
  response: ResponseType;

  constructor (response: ResponseType) {
    super();

    this.code = response.result.code;
    this.message = response.result.description;
    this.response = response;
  }
}

export class MalformedRequestError extends PayonError {
  errors: $ReadOnlyArray<ValidationErrorType>;

  constructor (errors: $ReadOnlyArray<ValidationErrorType>) {
    debug('request validation errors', errors);

    super('Malformed request. See the log for details');
  }
}
