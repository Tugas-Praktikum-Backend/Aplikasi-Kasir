const route = require('express').Router()
const db = require('../../database/database-manager').getDatabase("Customers")

// Controller
async function addCustomer(req, res, next){
    try {
        const {
            customer_name: customerName
        } = req.body;

        if(!customer_name) {
            throw Error('Name is required');
        }

        if (customerExists(customer_name)) {
            throw Error('Customer already exists');
        }
        
        const transactions = [];

        const result = await db.create({
            customer_name,
            transactions
        });
        if(!result){
            throw Error('Failed to fetch customers data');
        }
        res.status(201).json({ message: "Successfully added new customer.", customer_name: result });
    } catch(err){
        next(err);
    }
}

async function deleteCustomer(req, res, next){
    try {
        const id = req.params.id;
        if((!id) || (id === ":id")){
            throw Error('Missing id parameter');
        }
        const result = await db.deleteOne({ _id: id });
        if(!result){
            throw Error(`Failed to delete customer with id ${id}`);
        }
        res.status(201).json({ message: `Successfully deleted customer with id ${id}`});
    } catch(err){
        next(err);
    }
}

async function getCustomers(req, res, next){
    try {
        const result = await db.find({});
        if(!result){
            throw Error('Failed to fetch customers data');
        }
        res.status(201).json({ customer_name: result, transactions: result });
    } catch(err){
        next(err);
    }
}

async function getCustomer(req, res, next){
    try {
        const id = req.params.id;

        if((!id) || (id === ":id")){
            throw Error('Missing id parameter');
        }
        res.status(200).json({ customer_name: result, transactions: result });
    } catch (err) {
        next(err);
    }
}

async function updateCustomer(req, res, next){
    try {
        const {
            customer_name: customerName
        } = req.body;

        const id = req.params.id;
        if((!id) || (id === ":id")){
            throw Error('Missing id parameter');
        }

        if(!customer_name) {
            throw Error('Name is required');
        }

        const result = await db.updateOne({ _id: id }, { $set: {customer_name}})
        if(!result){
            throw Error(`Failed to delete customer with id ${id}`);
        }
        res.status(201).json({ message: `Successfully updated customer with id ${id}`});
    } catch(err){
        next(err);
    }
}

// Service
function customerExists(customerName) {
    const user = await db.findOne({ customerName });
    return !!user;
}

// Route
module.exports = (app) => {
    route.post('/', addCustomer);
    route.get('/', getCustomers);
    route.get('/:id', getCustomer),
    route.get('/:id/transactions', getCustomerTransactions),
    route.put('/:id', updateCustomer);
    route.delete('/:id', deleteCustomer);

    app.use('/customers', route);
}