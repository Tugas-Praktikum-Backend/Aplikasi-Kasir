const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Employees');
const { newToken } = require('../../middleware/middleware')

async function addEmployee(req, res, next) {
  try {
    const { employee_id, employee_name: employeeName, employee_password: employeePassword } = req.body;

    if (!employeeName || !employeePassword || !employeeId) {
      throw Error('employeeName and employeePassword are required');
    }

    const result = await db.create({
      employeeId: employee_id,
      employeeName,
      employeePassword,
    });

    if (!result) {
      throw Error('Failed to create employee');
    }

    res.status(201).json({
      message: `Successfully added new employee: ${employeeName}`,
    });
  } catch (err) {
    next(err);
  }
}

async function getEmployees(req, res, next) {
  try {
    const employees = await db.find();

    res.status(200).json({
      message: 'Successfully retrieved all employees',
      data: employees,
    });
  } catch (err) {
    next(err);
  }
}

async function getEmployee(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) throw Error('Missing id parameter');

    const employee = await db.findById(id);

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
    const id = req.params.id;
    if (!id) throw Error('Missing id parameter');

    const result = await db.findByIdAndUpdate(id, req.body, { new: true });

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
    const id = req.params.id;
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

async function loginEmployee(req, res, next){
  try {
    if(!req.body){
      throw Error('employeeName and employeePassword are required');
    }
    const { employeeName, employeePassword } = req.body;
    if (!employeeName || !employeePassword) {
      throw Error('employeeName and employeePassword are required');
    }

    const result = await db.find({ employeeName, employeePassword });
    if(!result || result.length <= 0){
      return res.status(401).json({
        message: `Authorization failed`,
      });
    }

    const token = newToken(result[0].employeeName);
    return res.status(200).json({
      message: `Authorization successfully`,
      token: token
    });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addEmployee);
  route.get('/', getEmployees);
  route.get('/:employeeId', getEmployee);
  route.put('/:employeeId', updateEmployee);
  route.delete('/:employeeId', deleteEmployee);
  route.post('/login', loginEmployee);

  app.use('/employees', route);
};
