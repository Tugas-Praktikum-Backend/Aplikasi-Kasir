module.exports = (db) => (
    {
        id: "Customers",
        model: db.model('Customers', db.Schema({
            customerName: String,
            transactionHistory: Array
        }))
    }
);