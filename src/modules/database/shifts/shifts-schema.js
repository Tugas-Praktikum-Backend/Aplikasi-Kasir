module.exports = (db) => (
    {
        id: "Shifts",
        model: db.model('Shifts', db.Schema({
            employeeId: { type: db.Schema.Types.ObjectId, ref: 'Employee', required: true },
            startTime: { type: Date, default: Date.now },
            endTime: { type: Date, default: null }
        }))
    }
);