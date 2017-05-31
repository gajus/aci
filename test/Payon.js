// @flow

import test from 'ava';
import Payon, {
  MalformedRequestError,
  PayonRemoteError
} from '../src/Payon';
import {
  apiUrl,
  authentication
} from './fixtures/config';

test('throws MalformedRequestError error if request body is malformed', async (t) => {
  const client = new Payon(apiUrl, authentication);

  // $FlowFixMe
  const request = client.createPayment({
    amount: 1
  });

  await t.throws(request, MalformedRequestError);
});

test('creates a DB', async (t) => {
  const client = new Payon(apiUrl, authentication);

  const response = await client.createPayment({
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
    paymentType: 'DB'
  });

  t.true(response.result.code === '000.100.110');
});

test('creates a PA and CP', async (t) => {
  const client = new Payon(apiUrl, authentication);

  const paResponse = await client.createPayment({
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
  });

  const cpResponse = await client.capturePayment(paResponse.id, {
    amount: '1.00',
    currency: 'GBP',
    paymentType: 'CP'
  });

  t.true(cpResponse.result.code === '000.100.110');
});

test('create a token during a PA; use the token for a DB', async (t) => {
  const client = new Payon(apiUrl, authentication);

  const paResponse = await client.createPayment({
    amount: '1.00',
    card: {
      cvv: '123',
      expiryMonth: '05',
      expiryYear: '2020',
      holder: 'Jane Jones',
      number: '4200000000000000'
    },
    createRegistration: true,
    currency: 'GBP',
    paymentBrand: 'VISA',
    paymentType: 'PA'
  });

  t.true(paResponse.result.code === '000.100.110');
  t.true(typeof paResponse.registrationId === 'string');

  const dbResponse = await client.createRegistrationPayment(paResponse.registrationId, {
    amount: '1.00',
    currency: 'GBP',
    paymentBrand: 'VISA',
    paymentType: 'DB'
  });

  t.true(dbResponse.result.code === '000.100.110');
});

test('rejected transaction raises PayonRemoteError error', async (t) => {
  const client = new Payon(apiUrl, authentication);

  const request = client.createPayment({
    amount: '1.00',
    card: {
      cvv: '123',
      expiryMonth: '05',
      expiryYear: '2020',
      holder: 'Jane Jones',
      number: '4200000000000001'
    },
    currency: 'GBP',
    paymentBrand: 'VISA',
    paymentType: 'DB'
  });

  const error = await t.throws(request, PayonRemoteError);

  t.true(error.code && error.code === '100.100.101');
});
