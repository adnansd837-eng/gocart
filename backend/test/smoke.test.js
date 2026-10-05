process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');

test('Backend Environment & Configuration Smoke Test', async (t) => {
  await t.test('Server exports app instance properly', () => {
    const app = require('../src/server');
    assert.ok(app, 'Express app should be defined');
  });

  await t.test('Routes are defined', () => {
    const productRoutes = require('../src/routes/productRoutes');
    assert.ok(productRoutes, 'Product routes should be defined');
    const storeRoutes = require('../src/routes/storeRoutes');
    assert.ok(storeRoutes, 'Store routes should be defined');
    const orderRoutes = require('../src/routes/orderRoutes');
    assert.ok(orderRoutes, 'Order routes should be defined');
  });
});
