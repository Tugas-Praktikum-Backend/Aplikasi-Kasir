module.exports = (db) => (
    {
        id: "Products",
        model: db.model('Products', db.Schema({
            productId: String,
            productName: String,
            productPrice: Number,
            productStock: Number
        }))
    }
);