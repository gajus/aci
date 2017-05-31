// @flow

import Ajv from 'ajv';
import paymentSchema from '../schemas/payment.json';
import cardSchema from '../schemas/card.json';
import type {
  PaymentType,
  ValidationErrorType
} from '../types';

const paymentRequestSchema = {
  additionalProperties: false,
  properties: {
    ...paymentSchema.properties,
    card: cardSchema
  },
  required: [
    ...paymentSchema.required
  ],
  type: 'object'
};

const ajv = new Ajv();
const validate = ajv.compile(paymentRequestSchema);

const noErrors = [];

// eslint-disable-next-line consistent-return
export default (payment: PaymentType): $ReadOnlyArray<ValidationErrorType> => {
  if (validate(payment)) {
    return noErrors;
  } else {
    return validate.errors;
  }
};
