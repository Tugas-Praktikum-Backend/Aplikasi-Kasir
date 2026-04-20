module.exports = (db) => (
    {
        id: "Customers",
        model: db.model('Customers', db.Schema({
            customerName: {type: String, required: true},
            paymentMethod: {type: [
                db.Schema({
                    provider: {
                        type: String, required: true, enum: ['BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'ShopeePay']
                    },
                    balance: { type: Number, default: 0 }
                }, {_id: false })
            ], default: [] 
        }}))
    }
);