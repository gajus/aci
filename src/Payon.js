// @flow

import qs from 'qs';
import fetch, {
  UnexpectedResponseCodeError
} from 'xfetch';
import {
  validatePayment
} from './validators';
import {
  MalformedRequestError,
  PayonRemoteError
} from './errors';
import type {
  AuthenticationType,
  PayloadType,
  PaymentType,
  ResponseType
} from './types';

export {
  MalformedRequestError,
  PayonRemoteError
} from './errors';
export type {
  AuthenticationType,
  PaymentType
} from './types';

const successfulTransactionCodeRule = /^(000\.000\.|000\.100\.1|000\.[36])/;
const maybeSuccessfulTransactionCodeRule = /^(000\.400\.0|000\.400\.100)/;

export default class Payon {
  apiUrl: string;
  authentication: AuthenticationType;

  constructor (apiUrl: string, authentication: AuthenticationType) {
    this.apiUrl = apiUrl;
    this.authentication = authentication;
  }

  async createPayment (payment: PaymentType) {
    const validationErrors = validatePayment(payment);

    if (validationErrors.length) {
      throw new MalformedRequestError(validationErrors);
    }

    const response = await Payon.post(this.apiUrl, this.authentication, 'payments', payment);

    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new PayonRemoteError(response);
  }

  async capturePayment (id: string, payment: PaymentType) {
    const validationErrors = validatePayment(payment);

    if (validationErrors.length) {
      throw new MalformedRequestError(validationErrors);
    }

    const response = await Payon.post(this.apiUrl, this.authentication, 'payments/' + id, payment);

    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new PayonRemoteError(response);
  }

  async createRegistrationPayment (registrationId: string, payment: PaymentType) {
    const response = await Payon.post(this.apiUrl, this.authentication, 'registrations/' + registrationId + '/payments', payment);

    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new PayonRemoteError(response);
  }

  static async post (apiUrl: string, authentication: AuthenticationType, resource: string, payload: PayloadType): Promise<ResponseType> {
    const response = await fetch(apiUrl + resource, {
      body: qs.stringify({
        ...payload,
        authentication
      }, {
        allowDots: true
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'payon'
      },
      isResponseValid: (intermediateResponse) => {
        if (!String(intermediateResponse.status).startsWith('2') && !String(intermediateResponse.status).startsWith('3') && intermediateResponse.status !== 400) {
          throw new UnexpectedResponseCodeError(response);
        }

        return true;
      },
      method: 'post',
      responseType: 'json'
    });

    return response;
  }
}
