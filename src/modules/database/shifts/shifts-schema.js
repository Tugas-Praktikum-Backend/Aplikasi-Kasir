module.exports = (db) => ({
  id: 'Shifts',
  model: db.model(
    'Shifts',
    db.Schema({
      employeeId: {
        type: String,
        ref: 'Employees',
        required: true,
      },
      startTime: { type: Date, default: Date.now },
      endTime: { type: Date, default: null },
    })
  ),
});
