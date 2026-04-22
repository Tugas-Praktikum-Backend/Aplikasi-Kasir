const route = require('express').Router();
const dbManager = require('../../database/database-manager');
const {checkExpired} = require("../../../utils/discountUtils");
const db = dbManager.getDatabase(
  'Transaction'
);
const productDb = dbManager.getDatabase(
  'Products'
);
const employeeDb = dbManager.getDatabase(
  'Employees'
);
const customerDb = dbManager.getDatabase(
  'Customers'
);
const shiftDb = dbManager.getDatabase(
  'Shifts'
);
const discountDb = dbManager.getDatabase(
  'Discounts'
);

const ADMIN_FEES = {
  BCA: 2500,
  MANDIRI: 3000,
  BRI: 2000,
  BNI: 2000,
  GOPAY: 1500,
  OVO: 1500,
  SHOPEEPAY: 1000,
};

async function addTransactions(req, res, next) {
  try {
    if (!req.body) {
      throw Error('Transaction data are missing!');
    }
    const payment_method = req.body.payment_method?.trim().toUpperCase();
    const employee_id = req.body.employee_id?.trim().toLowerCase();
    const customer_id = req.body.customer_id?.trim().toLowerCase();
    const purchase_list = req.body.purchase_list;

    if (!employee_id || !customer_id || !payment_method) {
      throw Error('Transactions data are missing!');
    }

    const employee = await employeeDb.findOne({
      employeeId: employee_id,
    });

    if (!employee) {
      throw Error(`Employee not found: ${employee_id}`);
    }

    const activeShift = await shiftDb.findOne({
      employeeId: employee_id,
      endTime: null,
    });

    if (!activeShift) {
      throw Error(
        `Transaction denied: Employee ${employee_id} is not currently on duty. Please start a shift first.`
      );
    }

    const customer = await customerDb.findOne({
      customerId: customer_id,
    });

    if (!customer) {
      throw Error(`Customer not found: ${customer_id}`);
    }

    if (!Array.isArray(customer.paymentMethod)) {
      throw Error(`Customer has no payment methods`);
    }

    const payment = customer.paymentMethod.find(
      (pm) => pm.provider?.toUpperCase() === payment_method
    );

    if (!payment) {
      throw Error(`Customer does not have payment method: ${payment_method}`);
    }

    if (!Array.isArray(purchase_list) || purchase_list.length === 0) {
      throw Error('purchase_list must be a non-empty array');
    }
    purchase_list.forEach((item) => {
      if (!item.product_id) {
        throw Error('product_id is required');
      }
      if (Number(item.product_amount) <= 0) {
        throw Error(`Invalid amount for product: ${item.product_id}`);
      }
    });
    const productIds = purchase_list.map((p) => {
      if (!p.product_id) {
        throw Error('product_id is required');
      }
      return p.product_id.toUpperCase().trim();
    });

    const products = await productDb.find({
      productId: { $in: productIds },
    });

    const foundIds = products
      .map((p) => (p.productId ? p.productId.toUpperCase() : null))
      .filter(Boolean);
    const missing = productIds.filter((id) => !foundIds.includes(id));

    if (missing.length > 0) {
      throw Error(`Products not found: ${missing.join(', ')}`);
    }

    const productMap = {};
    products.forEach((p) => {
      const key = p.productId ? p.productId.toUpperCase() : null;
      if (key) productMap[key] = p;
    });

    let totalPrice = 0;
    let discountList = discountDb.find({});
    discountList = discountList.map((data) => {
      if(!checkExpired(data))return undefined;
      return {
        productList: JSON.parse(data.products),
        discountAmount: data.discountAmount
      };
    });

    const finalPurchaseList = purchase_list.map((item) => {
      const normalizedId = item.product_id
        ? item.product_id.toUpperCase().trim()
        : null;

      const product = productMap[normalizedId];

      if (!product) {
        throw Error(`Product not found: ${item.product_id}`);
      }

      const amount = Number(item.product_amount);

      if (!amount || amount <= 0) {
        throw Error(`Invalid amount for product: ${item.product_id}`);
      }

      if (product.productStock < amount) {
        throw Error(
          `Insufficient stock for product ${product.productId}. Requested: ${amount}, Available: ${product.productStock}`
        );
      }

      product.productStock -= amount;

      const productPrice = product.productPrice;

      if (productPrice === undefined) {
        throw Error(`Product price missing: ${product.productId}`);
      }

      let subtotal = productPrice * amount;
      let discountTotal = 0;
      for(const discount of discountList){
        if(discount && discount.productList.products.find(normalizedId)){
          discountTotal += discount.discountAmount;
        }
      }

      totalPrice += (subtotal * (1 - Math.min(1, discountTotal)));

      return {
        productId: normalizedId,
        productPrice,
        productAmount: amount,
      };
    });

    const adminFee = ADMIN_FEES[payment_method];

    if (adminFee === undefined) {
      throw Error(`Unsupported payment method: ${payment_method}`);
    }

    const finalPrice = totalPrice + adminFee;

    if (payment.balance < finalPrice) {
      throw Error(
        `Insufficient balance for ${payment_method}. Required: ${finalPrice}, Available: ${payment.balance}`
      );
    }
    payment.balance -= finalPrice;

    const result = await db.create({
      paymentMethod: payment_method,
      employeeId: employee_id,
      customerId: customer_id,
      purchaseList: finalPurchaseList,
      price: totalPrice,
      adminFee: adminFee,
      finalPrice: finalPrice,
    });

    if (!result) {
      throw Error('Failed to create Transcations data');
    }

    await customer.save();
    await Promise.all(products.map((product) => product.save()));
    res.status(201).json({ message: 'Successfully added new Transactions' });
  } catch (err) {
    next(err);
  }
}

async function getTransactions(req, res, next) {
  try {
    const transactions = await db.find();

    res.status(200).json({
      message: 'Successfully retrieved all transactions',
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addTransactions);
  route.get('/', getTransactions);
  //route.get('/today', getTransactionsToday);
  //route.get('/monthly', getTransactionsMonthly);
  app.use('/transaction', route);
};
