# Payon

[![Travis build status](http://img.shields.io/travis/gajus/payon/master.svg?style=flat-square)](https://travis-ci.org/gajus/payon)
[![Coveralls](https://img.shields.io/coveralls/gajus/payon.svg?style=flat-square)](https://coveralls.io/github/gajus/payon)
[![NPM version](http://img.shields.io/npm/v/payon.svg?style=flat-square)](https://www.npmjs.org/package/payon)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

> DEPRECATED:
> Deprecated in favour of https://github.com/gajus/aci.

[Payon](https://payon.com/) server-to-server SDK.

> In its current state, the SDK is designed for the use with a specific application.
> However, should you have a use case that is not covered by the SDK, please raise an issue and I am happy to help.

## Usage

Payon SDK is using [Flow](https://flow.org/) type annotations and [JSON schemas](./schemas.json) to guide/ enforce the shape of the request and response.

```js
import Payon from 'payon';
import type {
  AuthenticationType,
  PaymentType
} from 'payon';

const apiUrl = 'https://test.oppwa.com/v1/';

/**
 * The test credentials are taken from https://docs.payon.com/tutorials/server-to-server.
 */
const authentication: AuthenticationType = {
  entityId: '8a829418571dad0401571e262e320b32',
  password: 'TPs5pfgH8e',
  userId: '8a829418571dad0401571e262ef80b36'
};

const client = new Payon(apiUrl, authentication);

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
* A response with a result code other than success results in a [`PayonRemoteError`](./errors.js) error.
