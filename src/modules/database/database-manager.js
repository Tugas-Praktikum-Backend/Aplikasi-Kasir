const mongoose = require('mongoose');
const list = [
  './discounts/discount-schema',
  './product/product-schema',
  './customers/customers-schema',
  './employees/employees-schema',
  './shifts/shifts-schema',
  './transaction/transaction-schema', 
];
const loaded = {};
let isLoaded = false;

function init() {
  console.log('Loading mongoose...');
  mongoose.connect(process.env.MONGO_URI, {dbName: 'kasir'}).then((r) => {
    for (const schemaPath of list) {
      const result = require(schemaPath)(mongoose);
      loaded[result.id] = result.model;
    }
    isLoaded = true;
    console.log("Mongoose has been loaded");
  });
}

function getDatabase(id) {
  return loaded[id];
}

function isDbLoaded() {
  return isLoaded;
}

module.exports = { init, getDatabase, isDbLoaded };
