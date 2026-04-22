const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Shifts');
const mongoose = require('mongoose');

async function startShift(req, res, next) {
  try {
    const employee_id =
      req.body.employee_id;

    const activeShift = await db.findOne({
      employeeId: employee_id,
      endTime: null,
    });
    if (activeShift) {
      throw Error('Employee already has an active shift');
    }

    const result = await db.create({
      employeeId: employee_id,
      startTime: new Date(),
    });

    if (!result) {
      throw Error('Failed to start shift');
    }

    res.status(201).json({
      message: 'Shift started successfully',
      employeeId: employeeId,
      shiftId: result._id,
      startTime: result.startTime,
    });
  } catch (err) {
    next(err);
  }
}

async function endShift(req, res, next) {
  try {
    const employee_id = req.body.employee_id;

    if (!employee_id) {
      throw Error('employee_id is required to end the shift');
    }

    const result = await db.findOneAndUpdate(
      { employeeId: employee_id, endTime: null },
      { $set: { endTime: new Date() } },
      { new: true }
    );

    if (!result) {
      throw Error('No active shift found for this employee');
    }

    res.status(200).json({
      message: 'Shift ended successfully',
      shift: result,
    });
  } catch (err) {
    next(err);
  }
}

async function getShifts(req, res, next) {
  try {
    const result = await db.find({});
    res.status(200).json({ Shifts: result });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', startShift);
  route.put('/', endShift);
  route.get('/', getShifts);

  app.use('/shifts', route);
};
