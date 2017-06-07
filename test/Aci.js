// @flow

import test from 'ava';
import Aci, {
  MalformedRequestError
} from '../src/Aci';
import {
  apiUrl,
  authentication
} from './fixtures/config';

test('throws MalformedRequestError error if request body is malformed', async (t) => {
  const client = new Aci(apiUrl, authentication);

  // $FlowFixMe
  const request = client.createPayment({
    amount: 1
  });

  await t.throws(request, MalformedRequestError);
});
