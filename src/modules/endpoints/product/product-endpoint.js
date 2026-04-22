const route = require('express').Router();
const db = require('../../database/database-manager').getDatabase('Products');

async function addProducts(req, res, next) {
  try {
    if (!req.body) {
      throw Error('Products data are missing!');
    }
    const {
      product_name,
      product_price,
    } = req.body;

    const product_id = req.body.product_id?.trim().toUpperCase();

    if (!product_id || !product_name || product_price === undefined) {
      throw Error('Products data are missing!');
    }
    
    const result = await db.create({
      productId: product_id,
      productName: product_name,
      productPrice: product_price,
    });
    if (!result) {
      throw Error('Failed to create Products data');
    }
    res.status(201).json({ message: 'Successfully added new Products' });
  } catch (err) {
    next(err);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await db.find();

    res.status(200).json({
      message: 'Successfully retrieved all products',
      data: products,
    });
  } catch (err) {
    next(err);
  }
}

async function getProductsById(req, res, next) {
  try {
    const id = req.params.productId?.trim().toUpperCase();
    if (!id || id === ':id') {
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
    const id = req.params.productId?.trim().toUpperCase();
    if (!id || id === ':id') {
      throw Error('Missing id parameter');
    }

    const { product_name, product_price } = req.body;

    

    const result = await db.findOneAndUpdate(
      { productId: id },
      { productName: product_name, productPrice: product_price },
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
    const id = req.params.productId?.trim().toUpperCase();
    if (!id || id === ':id') {
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
    const id = req.params.productId?.trim().toUpperCase();
    if (!id || id === ':id') {
      throw Error('Missing id parameter');
    }

    const { product_stock } = req.body;
    if (product_stock === undefined) {
      throw Error('Stock amount is missing!');
    }
    if (product_stock <= 0) {
      throw Error('Product stock must be greater than 0');
    }
    const result = await db.findOneAndUpdate(
      { productId: id },
      { $inc: { productStock: product_stock } },
      { new: true }
    );
    if (!result) {
      throw Error(`Failed to update stock for Products with id ${id}`);
    }

    res.status(200).json({
      message: `Successfully updated stock for Products with id ${id}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = (app) => {
  route.post('/', addProducts);
  route.get('/', getProducts);
  route.get('/:productId', getProductsById);
  route.put('/:productId', updateProductsById);
  route.delete('/:productId', deleteProducts);
  route.put('/:productId/stock', updateProductsStock);

  app.use('/products', route);
};
