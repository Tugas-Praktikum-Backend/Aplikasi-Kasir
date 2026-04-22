module.exports = (db) => ({
  id: 'Transaction',
  model: db.model(
    'Transaction',
    db.Schema({
      employeeID: {
        type: employeeID,
        ref: 'Employees',
        required: true,

      },
      customerID: {
        type: customerID,
        ref: 'Employees',
        required: true,
      },
      transactionDate: {
        type: Date,
        default: Date.now(0),
      },
      purchaseList: {
        type: [
          db.Schema(
            {
              productId: {
                type: String,
                required: true,
              },
              productPrice: {
              type: Number,
              required: true,
              },
              price: {
              type: Number,
              required: true,
              },
            },{
              _id: false
            }
          ),
        ],
        default: [],
      },
      price: {
        type: Number,
        default: 0,
      },
      paymenMethod: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      finalPrice: {
        type: Number,
        default: 0,
      }
    }
      )
  ),
});
