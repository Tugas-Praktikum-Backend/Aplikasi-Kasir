const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Customers');
const transactionDb = require('../../database/database-manager').getDatabase('Transaction');

// Controller
async function addCustomer(req, res, next) {
  try {
    const customer_id = req.body.customer_id?.trim().toLowerCase();
    const customer_name = req.body.customer_name;

    if (!customer_name) {
      throw Error('Name is required');
    }

    const result = await db.create({
      customerId: customer_id,
      customerName: customer_name,
    });

    if (!result) {
      throw Error('Failed to create customer');
    }
    res.status(201).json({
      message: `Successfully added new customer. Customer added: ${result.customerName}`,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const id = req.params.customerId?.trim().toLowerCase();
    if (!id || id === ':id') {
      throw Error('Missing ID parameter');
    }

    const result = await db.deleteOne({ customerId: id });
    if (!result) {
      throw Error(`Failed to delete customer with id ${id}`);
    }
    res
      .status(200)
      .json({ message: `Successfully deleted customer with id ${id}` });
  } catch (err) {
    next(err);
  }
}

async function getCustomers(req, res, next) {
  try {
    const result = await db.find({});
    const customers = await db.find();
    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
}

async function getCustomer(req, res, next) {
  try {
    const id = req.params.customerId?.trim().toLowerCase();
    if (!id || id === ':customerId') {
      throw Error('Missing ID parameter');
    }
    const result = await db.findOne({ customerId: id });
    if (!result) {
      throw Error('Customer not found');
    }
    res.status(200).json({ Customers: result });
  } catch (err) {
    next(err);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const customerName = req.body.customer_name?.trim().toLowerCase();

    const id = req.params.customerId?.trim().toLowerCase();
    if (!id || id === ':customerId') {
      throw Error('Missing ID parameter');
    }

    if (!customerName) {
      throw Error('Name is required');
    }

    const result = await db.findOneAndUpdate(
      { customerId: id },
      { $set: { customerName } }
    );
    if (!result) {
      throw Error(`Failed to update customer with id ${id}`);
    }
    res
      .status(200)
      .json({ message: `Successfully updated customer with id ${id}` });
  } catch (err) {
    next(err);
  }
}

async function addPayment(req, res, next) {
  try {
    const provider = req.body.provider?.trim().toUpperCase();
    const id = req.params.customerId?.trim().toLowerCase();

    if (!provider) {
      throw Error('Provider is required');
    }

    const ALLOWED_PROVIDERS = [
      'OVO',
      'GOPAY',
      'DANA',
      'SHOPEEPAY',
      'BRI',
      'MANDIRI',
      'BNI',
    ];

    if (!ALLOWED_PROVIDERS.includes(provider)) {
      throw Error(`Invalid provider. Allowed: ${ALLOWED_PROVIDERS.join(', ')}`);
    }

    const result = await db.updateOne(
      { 'customerId': id, 'paymentMethod.provider': { $ne: provider } },
      { $push: { paymentMethod: { provider, balance: 0 } } }
    );

    if (result.matchedCount === 0) {
      throw Error('Customer not found');
    }

    if (result.modifiedCount === 0) {
      throw Error('Payment already exists');
    }

    res.status(200).json({ message: `Payment method ${provider} added` });
  } catch (err) {
    next(err);
  }
}

async function topUp(req, res, next) {
  try {
    const provider = req.body.provider?.trim().toUpperCase();
    const amount = Number(req.body.amount);
    const id = req.params.customerId?.trim().toLowerCase();
    if (!id || id === ':customerId') {
      throw Error('Missing ID parameter');
    }

    if (!provider) {
      throw Error('Provider is required');
    }

    const customer = await db.findOne({ customerId: id });
    if (!customer) {
      throw Error('Customer not found');
    }

    const payment = customer.paymentMethod.find((p) => p.provider === provider);
    if (!payment) {
      throw Error('Payment method not found');
    }

    if (!amount || amount <= 0) {
      throw Error('Amount must be greater than 0');
    }
    const result = await db.updateOne(
      { 'customerId': id, 'paymentMethod.provider': provider },
      { $inc: { 'paymentMethod.$.balance': amount } }
    );

    const updated = await db.findOne({ customerId: id });
    const updatedPayment = updated.paymentMethod.find(
      (p) => p.provider === provider
    );

    if (result.matchedCount === 0) {
      throw Error('Customer or payment not found');
    }

    res
      .status(200)
      .json({ message: 'Top up success', balance: updatedPayment.balance });
  } catch (err) {
    next(err);
  }
}

async function deletePayment(req, res, next) {
  try {
    const provider = req.body.provider?.trim().toUpperCase();
    const id = req.params.customerId?.trim().toLowerCase();

    if (!provider) {
      throw Error('Provider is required');
    }

    const result = await db.updateOne(
      { 'customerId': id, 'paymentMethod.provider': provider },
      { $pull: { paymentMethod: { provider } } }
    );

    if (result.matchedCount === 0) {
      throw Error('Customer not found');
    }

    if (result.modifiedCount === 0) {
      throw Error(`Payment ${provider} not found`);
    }

    res.status(200).json({
      message: `Payment ${provider} deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
}

async function getTransaction(req, res, next) {
  try {
    const id = req.params.customerId?.trim().toLowerCase();

    if (!id || id === ':customerId') {
      throw Error('Missing ID parameter');
    }

    const customer = await db.findOne({ customerId: id });
    if (!customer) {
      throw Error('Customer not found');
    }

    const transactions = await transactionDb.find({ customerId: id });

    res.status(200).json({
      customerId: id,
      totalTransactions: transactions.length,
      transactions,
    });
  } catch (err) {
    next(err);
  }
}



// Route
module.exports = (app) => {
  route.post('/', addCustomer);
  route.get('/', getCustomers);
  route.get('/:customerId', getCustomer);
  route.put('/:customerId', updateCustomer);
  route.put('/:customerId/topup', topUp);
  route.put('/:customerId/payment', addPayment);
  route.delete('/:customerId/payment', deletePayment);
  route.delete('/:customerId', deleteCustomer);
  route.get('/:customerId/transactions', getTransaction);

  app.use('/customers', route);
};
