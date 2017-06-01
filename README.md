# ACI

[![Travis build status](http://img.shields.io/travis/gajus/aci/master.svg?style=flat-square)](https://travis-ci.org/gajus/aci)
[![Coveralls](https://img.shields.io/coveralls/gajus/aci.svg?style=flat-square)](https://coveralls.io/github/gajus/aci)
[![NPM version](http://img.shields.io/npm/v/aci.svg?style=flat-square)](https://www.npmjs.org/package/aci)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

[ACI](https://www.aciworldwide.com/) [Universal Payments (server-to-server)](https://docs.aciworldwide.com/reference/parameters) SDK.

## Usage

Aci SDK is using [Flow](https://flow.org/) type annotations and [JSON schemas](./schemas.json) to guide/ enforce the shape of the request and response.

```js
import Aci from 'aci';
import type {
  AuthenticationType,
  PaymentType
} from 'aci';

const apiUrl = 'https://test.oppwa.com/v1/';

/**
 * The test credentials are taken from https://docs.aciworldwide.com/tutorials/server-to-server.
 */
const authentication: AuthenticationType = {
  entityId: '8a829418571dad0401571e262e320b32',
  password: 'TPs5pfgH8e',
  userId: '8a829418571dad0401571e262ef80b36'
};

const client = new Aci(apiUrl, authentication);

const paymentPayload: PaymentType = {
  amount: '1.00',
  card: {
    cvv: '123',
    expiryMonth: '05',
    expiryYear: '2020',
    holder: 'Jane Jones',
    number: '4200000000000000'
  },
  currency: 'GBP',
  paymentBrand: 'VISA',
  paymentType: 'PA'
};

const paResponse = await client.createPayment(paymentPayload);

```

## Handling errors

* A malformed request results in a [`MalformedRequestError`](./errors.js) error.
* A response with a result code other than success results in a [`AciRemoteError`](./errors.js) error.
