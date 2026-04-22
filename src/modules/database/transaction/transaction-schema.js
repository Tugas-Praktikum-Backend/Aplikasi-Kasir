module.exports = (db) => ({
  id: 'Transaction',
  model: db.model(
    'Transaction',
    db.Schema({
      employeeId: {
        type: String,
        ref: 'Employees',
        required: true,
      },
      customerId: {
        type: String,
        ref: 'Customers',
        required: true,
      },
      transactionDate: {
        type: Date,
        default: Date.now,
      },
      purchaseList: {
        type: [
          db.Schema(
            {
              productId: {
                type: String,
                ref: 'Products',
                required: true,
              },
              productPrice: {
                type: Number,
                required: true,
              },
              productAmount: {
                type: Number,
                required: true,
                min: 1,
              },
            },
            {
              _id: false,
            }
          ),
        ],
        default: [],
      },
      price: {
        type: Number,
        default: 0,
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      /*    discount: {
        type: Number,
        ref: 'Discounts',
      },*/
      adminFee: {
        type: Number,
        default: 0,
      },
      finalPrice: {
        type: Number,
        default: 0,
      },
    })
  ),
});
