const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Transactions');

async function addTransactions(req, res, next) {
  try {
    if (!req.body) {
      throw Error('Transaction data are missing!');
    }
    const {
      payment_method,
    } = req.body;

    const employee_id = req.body.employee_id?.trim().toLowerCase();
    const customer_id = req.body.customer_id?.trim().toLowerCase();

    if (!employee_id || !customer_id || !payment_method) {
      throw Error('Transactions data are missing!');
    }
    
    const result = await db.create({
      paymenMethod : payment_method,
      employeeID : employee_id,
      customerID : customerID,

    });
    if (!result) {
      throw Error('Failed to create Transcations data');
    }
    res.status(201).json({ message: 'Successfully added new Transactions' });
  } catch (err) {
    next(err);
  }
}

async function getTransactions(req, res, next) {
  try {
    const transactions = await db.find();

    res.status(200).json({
      message: 'Successfully retrieved all transactions',
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addTransactions);
  route.get('/', getTransactions);
  route.get('/today', getTransactionsToday);
route.get('/monthly', getTransactionsMonthly);
  app.use('/transaction', route);
};