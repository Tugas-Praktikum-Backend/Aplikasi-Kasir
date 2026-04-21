const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Products');

async function addProducts(req, res, next) {
  try {
    if (!req.body) {
      throw Error('Products data are missing!');
    }
    const { productId, productName, productPrice } = req.body;
    if (!productId || !productName || !productPrice === undefined) {
      throw Error('Products data are missing!');
    }
    const result = await db.create({
      productId: productId,
      productName: productName,
      productPrice: productPrice,
    });
    if (!result) {
      throw Error('Failed to create Products data');
    }
    res.status(201).json({ message: 'Successfully added new Products' });
  } catch (err) {
    next(err);
  }
}

async function getProductsById(req, res, next) {
  try {
    const id = req.params.productId;
    if (!id || id === ':productId') {
      throw Error('Missing id parameter');
    }
    const result = await db.findOne({ productId: id });
    if (!result) {
      throw Error('Failed to get Products data');
    }
    res.status(200).json({ Products: result });
  } catch (err) {
    next(err);
  }
}

async function updateProductsById(req, res, next) {
  try {
    const id = req.params.productId;
    if (!id || id === ':productId') {
      throw Error('Missing id parameter');
    }

    const { productName, productPrice } = req.body;

    const result = await db.findOneAndUpdate(
      { productId: id },
      { productName, productPrice },
      { new: true }
    );

    if (!result) {
      throw Error(`Failed to update Products with id ${id}`);
    }

    res
      .status(200)
      .json({ message: `Successfully updated Products with id ${id}` });
  } catch (err) {
    next(err);
  }
}

async function deleteProducts(req, res, next) {
  try {
    const id = req.params.productId;
    if (!id || id === 'productId') {
      throw Error('Missing id parameter');
    }

    const result = await db.deleteOne({ productId: id });
    if (!result) {
      throw Error(`Failed to delete Products with id ${id}`);
    }

    res
      .status(200)
      .json({ message: `Successfully deleted Products with id ${id}` });
  } catch (err) {
    next(err);
  }
}

async function updateProductsStock(req, res, next) {
  try {
    const id = req.params.productId;
    if (!id || id === 'productId') {
      throw Error('Missing id parameter');
    }

    const { productStock } = req.body;
    if (productStock === undefined) {
      throw Error('Stock amount is missing!');
    }
    if (productStock <= 0) {
      throw Error('Product stock must be greater than 0');
    }
    const result = await db.updateOne(
      { productId: id },
      { $inc: { productStock: productStock } },
      { new: true }
    );
    if (!result) {
      throw Error(`Failed to update stock for Products with id ${id}`);
    }

    res
      .status(200)
      .json({
        message: `Successfully updated stock for Products with id ${id}`,
      });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addProducts);
  route.get('/:productId', getProductsById);
  route.put('/:productId', updateProductsById);
  route.delete('/:productId', deleteProducts);
  route.put('/:productId/stock', updateProductsStock);

  app.use('/products', route);
};
