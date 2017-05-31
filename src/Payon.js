// @flow

import qs from 'qs';
import fetch from 'xfetch';
import {
  createDebug
} from './factories';
import type {
  AuthenticationType,
  PaymentType
} from './types';

const debug = createDebug('Payon');

type PayloadType = {
  [key: string]: string | PayloadType
};

type ResponseType = {
  result: {
    code: string,
    description: string
  }
};

export default class Payon {
  apiUrl: string;
  authentication: AuthenticationType;

  constructor (apiUrl: string, authentication: AuthenticationType) {
    this.apiUrl = apiUrl;
    this.authentication = authentication;
  }

  createPayment (payment: PaymentType) {
    return Payon.post(this.apiUrl, this.authentication, 'payments', payment);
  }

  static async post (apiUrl: string, authentication: AuthenticationType, resource: 'payments', payload: PayloadType): Promise<ResponseType> {
    const response = await fetch(apiUrl + 'payments', {
      body: qs.stringify({
        ...payload,
        authentication
      }, {
        allowDots: true
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'npm/gajus/payon'
      },
      method: 'post',
      responseType: 'json'
    });

    return response;
  }
}
