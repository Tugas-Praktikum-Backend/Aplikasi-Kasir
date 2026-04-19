module.exports = (db) => (
    {
        id: "Discounts",
        model: db.model('Discounts', db.Schema({
            products: String,
            discountAmount: Number
        }))
    }
);