const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Discounts');
const { checkExpired } = require('../../../utils/discountUtils');

async function getDiscounts(req, res, next) {
  try {
    let result = await db.find({});
    if (!result) {
      throw Error('Failed to fetch discounts data');
    }

    let start = req.query.start;
    let end = req.query.end;
    if (start && end) {
      let temp = [];
      start = new Date(Date.parse(start));
      end = new Date(Date.parse(end));
      for (const data of result) {
        if (!checkExpired(data, start, end)) temp.push(data);
      }
      result = temp;
    }
    
    let finalResults = [];
    for(const data of result){
      let d = [];
      data.forEach((e, k) => d[k] = e)
      finalResults.push(d)
    }
    return res.status(201).json({ discounts: finalResults });
  } catch (err) {
    next(err);
  }
}

async function addDiscount(req, res, next) {
  try {
    if (!req.body) {
      throw Error('Missing body!');
    }
    const { products, discount_amount, discount_duration } = req.body;
    if (!products || !discount_amount || !discount_duration) {
      throw Error(
        'Products, discount amount, and discount duration are required'
      );
    }
    const result = await db.create({
      products: JSON.stringify(products),
      discountAmount: discount_amount,
      discountStart: Math.floor(Date.now() / 1000),
      discountDuration: discount_duration,
    });
    if (!result) {
      throw Error('Failed to add new discount');
    }
    res.status(201).json({ message: 'Successfully added new discount' });
  } catch (err) {
    next(err);
  }
}

async function deleteDiscount(req, res, next) {
  try {
    const id = req.params.id;
    if (!id || id === ':id') {
      throw Error('Missing id parameter');
    }
    const result = await db.deleteOne({ _id: id });
    if (!result) {
      throw Error(`Failed to delete discount with id ${id}`);
    }
    res
      .status(201)
      .json({ message: `Successfully deleted discount with id ${id}` });
  } catch (err) {
    next(err);
  }
}

async function getDiscountById(req, res, next) {
  try {
    if (!req.params.id) {
      throw Error('Invalid discount ID!');
    }
    const result = await db.find({ _id: req.params.id });
    if (!result || result.length <= 0) {
      throw Error('Invalid discount ID');
    }
    res.status(201).json({ discounts: result });
  } catch (err) {
    next(err);
  }
}

async function updateDiscount(req, res, next) {
  try {
    if (!req.params.id) throw Error('Invalid discount ID');

    if (!req.body) {
      throw Error('Missing body!');
    }
    const { products, discount_amount, discount_duration } = req.body;
    const result = await db.find({ _id: req.params.id });
    if (!result || result.length <= 0) {
      throw Error('Invalid discount ID');
    }
    const lastData = result[0];
    const data = {
      _id: req.params.id ?? lastData['_id'],
      products: JSON.stringify(products) ?? lastData['products'],
      discountAmount: discount_amount ?? lastData['discountAmount'],
      discountDuration: discount_duration ?? lastData['discountDuration'],
    };
    if (!(await db.updateOne(data))) {
      return res
        .status(201)
        .json({ message: 'Failed to update the discount data' });
    }
    return res
      .status(201)
      .json({ message: 'Successfully updated discount data' });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addDiscount);
  route.get('/', getDiscounts);
  route.get('/:id', getDiscountById);
  route.patch('/:id', updateDiscount);
  route.delete('/:id', deleteDiscount);

  app.use('/discounts', route);
};
