const main = require('./index.js');
console.log('\nBasic testing file');

// Mocking up
const mock = {
  user: 'username',
};

// Tests
console.log(
  'Testing if response includes user:',
  main.parseResponse(mock.user).includes(`@${mock.user}`),
);
console.log(
  'Testing with a seed ot 10 templates, if random and not undefined:',
  [...Array(10)]
    .map(() => {
      const template = main.parseResponse(mock.user);
      return { template, isValid: template.includes(`@${mock.user}`) };
    })
    .every((template) => template.isValid),
);

/*
  * TODO
  - Include jest testing
*/
