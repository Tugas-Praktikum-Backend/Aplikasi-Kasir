const route = require('express').Router()
const db = require('../../database/database-manager').getDatabase("Discounts")

async function getDiscounts(req, res, next){
    try {
        const result = await db.find({});
        if(!result){
            throw Error('Failed to fetch discounts data');
        }
        res.status(201).json({ discounts: result });
    } catch(err){
        next(err);
    }
}

async function addDiscount(req, res, next){
    try {
        if(!req.body){
            throw Error('Products or discount amount are missing!');
        }
        const { products, discountAmount } = req.body;
        if(!products || !discountAmount){
            throw Error('Products or discount amount are missing!');
        }
        const result = await db.create({
            products: JSON.stringify(products),
            discountAmount: discountAmount
        });
        if(!result){
            throw Error('Failed to fetch discounts data');
        }
        res.status(201).json({ message: "Successfully added new discount "});
    } catch(err){
        next(err);
    }
}

async function deleteDiscount(req, res, next){
    try {
        const id = req.params.id;
        if((!id) || (id === ":id")){
            throw Error('Missing id parameter');
        }
        const result = await db.deleteOne({ _id: id });
        if(!result){
            throw Error(`Failed to delete discount with id ${id}`);
        }
        res.status(201).json({ message: `Successfully deleted discount with id ${id}`});
    } catch(err){
        next(err);
    }
}

module.exports = (app) => {
    route.get('/', getDiscounts);
    route.post('/', addDiscount);
    route.delete('/:id', deleteDiscount);

    app.use('/discounts', route);
}