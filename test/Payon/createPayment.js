// @flow

import test from 'ava';
import Payon from '../../src/Payon';
import {
  apiUrl,
  authentication
} from '../fixtures/config';

test('creates a token for a payment method', async (t) => {
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
