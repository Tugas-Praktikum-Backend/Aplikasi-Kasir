const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Customers');

// Controller
async function addCustomer(req, res, next) {
  try {
    const customerName = req.body.customer_name?.trim().toLowerCase();

    if (!customerName) {
      throw Error('Name is required');
    }

    if (await customerExists(customerName)) {
      throw Error('Customer already exists');
    }

    const result = await db.create({
      customerName,
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
    const id = req.params.id;
    if (!id || id === ':productId') {
      throw Error('Missing id parameter');
    }

    const result = await db.deleteOne({ _id: id });
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
    const customers = result.map((c) => ({
      id: c._id,
      customer_name: c.customerName,
      payment_method: c.paymentMethod,
    }));
    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
}

async function getCustomer(req, res, next) {
  try {
    const id = req.params.id;
    if (!id || id === ':productId') {
      throw Error('Missing id parameter');
    }
    const result = await db.findOne({ _id: id });
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

    const id = req.params.id;
    if (!id || id === ':productId') {
      throw Error('Missing id parameter');
    }

    if (!customerName) {
      throw Error('Name is required');
    }

    const result = await db.findOneAndUpdate(
      { _id: id },
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
    const id = req.params.id;

    if (!provider) {
      throw Error('Provider is required');
    }

    const result = await db.updateOne(
      { '_id': id, 'paymentMethod.provider': { $ne: provider } },
      { $push: { paymentMethod: { provider, balance: 0 } } }
    );

    if (result.matchedCount === 0) {
      throw Error('Customer not found');
    }

    if (result.modifiedCount === 0) {
      throw Error('Payment already exists');
    }

    res.status(200).json({ message: 'Payment method added' });
  } catch (err) {
    next(err);
  }
}

async function topUp(req, res, next) {
  try {
    const provider = req.body.provider?.trim().toUpperCase();
    const amount = Number(req.body.amount);
    const id = req.params.id;

    if (!provider) {
      throw Error('Provider is required');
    }

    const customer = await db.findById(id);
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
      { '_id': id, 'paymentMethod.provider': provider },
      { $inc: { 'paymentMethod.$.balance': amount } }
    );

    const updated = await db.findById(id);
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
    const id = req.params.id;

    if (!provider) {
      throw Error('Provider is required');
    }

    const result = await db.updateOne(
      { '_id': id, 'paymentMethod.provider': provider },
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
// Service
async function customerExists(customerName) {
  const user = await db.findOne({
    customerName: customerName.trim().toLowerCase(),
  });
  return !!user;
}

// Route
module.exports = (app) => {
  route.post('/', addCustomer);
  route.get('/', getCustomers);
  route.get('/:id', getCustomer);
  route.put('/:id', updateCustomer);
  route.put('/:id/topup', topUp);
  route.put('/:id/payment', addPayment);
  route.delete('/:id/payment', deletePayment);
  route.delete('/:id', deleteCustomer);

  app.use('/customers', route);
};
