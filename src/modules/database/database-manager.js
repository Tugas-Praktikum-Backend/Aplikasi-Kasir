const mongoose = require("mongoose");
const list = [
    "./products/product-schema",
    "./discounts/discount-schema",
    "./customers/customers-schema"
];
const loaded = {};
let isLoaded = false;

function init(){
    mongoose.connect(process.env.MONGO_URI).then(r => {
        for(const schemaPath of list){
            const result = require(schemaPath)(mongoose);
            loaded[result.id] = result.model;
        }
        isLoaded = true;
    });
}

function getDatabase(id){
    return loaded[id]
}

function isDbLoaded(){
    return isLoaded
}

module.exports = { init, getDatabase, isDbLoaded }