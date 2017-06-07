// @flow

import qs from 'qs';
import fetch, {
  UnexpectedResponseCodeError
} from 'xfetch';
import {
  validatePayment
} from './validators';
import {
  AciRemoteError,
  MalformedRequestError
} from './errors';
import type {
  AuthenticationType,
  PayloadType,
  PaymentType,
  ResponseType
} from './types';

export {
  AciRemoteError,
  MalformedRequestError
} from './errors';
export type {
  AuthenticationType,
  PaymentType
} from './types';

// @todo Document source of the regex rules.
const successfulTransactionCodeRule = /^(000\.000\.|000\.100\.1|000\.[36])/;
const maybeSuccessfulTransactionCodeRule = /^(000\.400\.0|000\.400\.100)/;

export default class Aci {
  apiUrl: string;
  authentication: AuthenticationType;

  constructor (apiUrl: string, authentication: AuthenticationType) {
    this.apiUrl = apiUrl;
    this.authentication = authentication;
  }

  /**
   * https://docs.aciworldwide.com/reference/parameters#basic
   */
  async createPayment (payment: PaymentType) {
    const validationErrors = validatePayment(payment);

    if (validationErrors.length) {
      throw new MalformedRequestError(validationErrors);
    }

    const response = await Aci.post(this.apiUrl, this.authentication, 'payments', payment);

    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new AciRemoteError(response);
  }

  /**
   * @see https://docs.aciworldwide.com/tutorials/manage-payments/backoffice#capture
   */
  async capturePayment (id: string, payment: PaymentType) {
    const validationErrors = validatePayment(payment);

    if (validationErrors.length) {
      throw new MalformedRequestError(validationErrors);
    }

    const response = await Aci.post(this.apiUrl, this.authentication, 'payments/' + id, payment);

    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new AciRemoteError(response);
  }

  async createRegistrationPayment (registrationId: string, payment: PaymentType) {
    const validationErrors = validatePayment(payment);

    if (validationErrors.length) {
      throw new MalformedRequestError(validationErrors);
    }

    const response = await Aci.post(this.apiUrl, this.authentication, 'registrations/' + registrationId + '/payments', payment);

    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new AciRemoteError(response);
  }

  /**
   * @see https://docs.aciworldwide.com/tutorials/manage-payments/backoffice#refund
   * @see https://docs.aciworldwide.com/reference/parameters#basic
   */
  async reversePayment (paymentId: string) {
    const response = await Aci.post(this.apiUrl, this.authentication, 'payments/' + paymentId, {
      paymentType: 'RV'
    });

    // @todo Find out which are the expected/ unexpected response codes for RV.
    if (successfulTransactionCodeRule.test(response.result.code) || maybeSuccessfulTransactionCodeRule.test(response.result.code)) {
      return response;
    }

    throw new AciRemoteError(response);
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
        'user-agent': 'aci'
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
