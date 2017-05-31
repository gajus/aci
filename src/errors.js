// @flow

import ExtendableError from 'es6-error';
import type {
  ResponseType
} from './types';

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
