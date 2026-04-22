module.exports = (db) => ({
  id: 'Employees',
  model: db.model(
    'Employees',
    db.Schema({
      employeeId: {
        type: String,
        unique: true,
      },
      employeeName: {
        type: String,
        required: true,
        trim: true,
      },
      employeePassword: {
        type: String,
        required: true,
      },
    })
  ),
});
