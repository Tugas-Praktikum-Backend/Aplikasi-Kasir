module.exports = (db) => ({
  id: 'Products',
  model: db.model(
    'Products',
    db.Schema({
      productName: { type: String, required: true },
      productPrice: { type: Number, required: true },
      productStock: { type: Number, default: 0 },
    })
  ),
});
