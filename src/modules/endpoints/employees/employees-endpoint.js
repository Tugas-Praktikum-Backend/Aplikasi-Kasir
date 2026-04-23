const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Employees');
const { newToken } = require('../../middleware/middleware');
const transactionDb = require('../../database/database-manager').getDatabase('Transactions');

async function addEmployee(req, res, next) {
  try {
    const { employee_name, employee_password } = req.body;
    const employee_id = req.body.employee_id?.trim().toLowerCase();
    if (!employee_name || !employee_password || !employee_id) {
      throw Error('Employee name and password are required');
    }

    const result = await db.create({
      employeeId: employee_id,
      employeeName: employee_name,
      employeePassword: employee_password,
    });

    if (!result) {
      throw Error('Failed to create employee');
    }

    res.status(201).json({
      message: `Successfully added new employee: ${employee_id}`,
    });
  } catch (err) {
    next(err);
  }
}

async function getEmployees(req, res, next) {
  try {
    const employees = await db.find();

    res.status(200).json({
      employees,
    });
  } catch (err) {
    next(err);
  }
}

async function getEmployee(req, res, next) {
  try {
    const id = req.params.employeeId?.trim().toLowerCase();
    if (!id) throw Error('Missing ID parameter');

    const employee = await db.findOne({ employeeId: id });

    res.status(200).json({
      message: `Successfully retrieved employee with id ${id}`,
      data: employee,
    });
  } catch (err) {
    next(err);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const id = req.params.employeeId?.trim().toLowerCase();
    if (!id) throw Error('Missing ID parameter');
    if (!req.body) throw Error('Missing body');

    const employee_name = req.body.employee_name;
    if (!employee_name) throw Error('Missing updated employee name');

    const result = await db.findOneAndUpdate(
      { employeeId: id },
      { $set: { employeeName: employee_name } }
    );

    if (!result) {
      throw Error(`Failed to update customer with id ${id}`);
    }

    res.status(200).json({
      message: `Successfully updated employee with id ${id}`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const id = req.params.employeeId?.trim().toLowerCase();
    if (!id) throw new Error('Missing id parameter');

    const result = await db.deleteOne({ employeeId: id });

    if (result.deletedCount === 0) {
      throw new Error(`Failed to delete employee with id ${id}`);
    }

    res.status(200).json({
      message: `Successfully deleted employee with id ${id}`,
    });
  } catch (err) {
    next(err);
  }
}

async function loginEmployee(req, res, next) {
  try {
    const { employee_id, employee_password } = req.body;

    const normalizedId = employee_id?.trim().toLowerCase();
    if (!normalizedId || !employee_password) {
      throw Error('Employee ID and password are required');
    }

    const result = await db.findOne({
      employeeId: normalizedId,
      employeePassword: employee_password,
    });
    if (!result) {
      return res.status(401).json({
        message: `Authorization failed`,
      });
    }

    const token = newToken(result.employeeName);
    return res.status(200).json({
      message: `Authorization successfully`,
      token: token,
    });
  } catch (err) {
    next(err);
  }
}

async function getTransactions(req, res, next) {
  try {
    const id = req.params.employeeId?.trim().toLowerCase();

    if (!id || id === ':employeeId') {
      throw Error('Missing ID parameter');
    }

    // optional: check if customer exists (so you don't return empty and confuse yourself later)
    const employee = await db.findOne({ employeeId: id });
    if (!employee) {
      throw Error('Employee not found');
    }

    const transactions = await transactionDb.find({ employeeId: id });

    res.status(200).json({
      employeeId: id,
      totalTransactions: transactions.length,
      transactions,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addEmployee);
  route.get('/', getEmployees);
  route.get('/:employeeId', getEmployee);
  route.get('/:employeeId/transaction', getTransactions);
  route.put('/:employeeId', updateEmployee);
  route.delete('/:employeeId', deleteEmployee);
  route.post('/login', loginEmployee);

  app.use('/employees', route);
};
