module.exports = (db) => ({
  id: 'Employees',
  model: db.model(
    'Employees',
    db.Schema({
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
