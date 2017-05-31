// @flow

import debug from 'debug';

export default (namespace: string) => {
  return debug('payon:' + namespace);
};
