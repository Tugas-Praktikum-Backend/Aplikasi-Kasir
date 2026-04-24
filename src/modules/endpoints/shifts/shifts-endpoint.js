const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Shifts');
const employeeDb = require('../../database/database-manager').getDatabase(
  'Employees'
);
const mongoose = require('mongoose');

async function startShift(req, res, next) {
  try {
    const employee_id = req.body.employee_id?.trim().toLowerCase();

    const employeeExists = await employeeDb.findOne({
      employeeId: employee_id,
    });

    if (!employeeExists) {
      throw Error('Invalid employee_id (not found in Employees database)');
    }

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
      employeeId: employee_id,
      shiftId: result._id,
      startTime: result.startTime,
    });
  } catch (err) {
    next(err);
  }
}

async function endShift(req, res, next) {
  try {
    const employee_id = req.body.employee_id?.trim().toLowerCase();

    if (!employee_id) {
      throw Error('Employee ID is required to end the shift');
    }

    const result = await db.findOneAndUpdate(
      { employeeId: employee_id, endTime: null },
      { $set: { endTime: new Date() } },
      { new: true }
    );

    if (!result) {
      throw Error('No active shift found for this employee');
    }

    // New Feature: Calculate the duration of the shift
    const durationMs = result.endTime - result.startTime;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    res.status(200).json({
      message: 'Shift ended successfully',
      shift: result,
      duration: `${durationHours} hours, ${durationMinutes} minutes`,
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

async function getShiftsFromId(req, res, next) {
  try {
    const id = req.params.employeeId?.trim().toLowerCase();
    if (!id || id === ':employeeId') {
      throw Error('Missing ID parameter');
    }
    const result = await db.find({ employeeId: id });
    if (!result) {
      throw Error('Employee not found');
    }
    res.status(200).json({ Shifts: result });
  } catch (err) {
    next(err);
  }
}

async function getActiveShifts(req, res, next) {
  try {
    const result = await db.find({ endTime: null });

    res.status(200).json({
      message: 'Successfully retrieved active shifts',
      activeShifts: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', startShift);
  route.put('/', endShift);
  route.get('/', getShifts);
  route.get('/active', getActiveShifts);
  route.get('/:employeeId', getShiftsFromId);

  app.use('/shifts', route);
};
