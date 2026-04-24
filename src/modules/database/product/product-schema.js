module.exports = (db) => ({
  id: 'Products',
  model: db.model(
    'Products',
    db.Schema({
      productId: { type: String, unique: true, required: true },
      productName: { type: String, required: true },
      productPrice: { type: Number, required: true },
      productStock: { type: Number, default: 0 },
    })
  ),
});
