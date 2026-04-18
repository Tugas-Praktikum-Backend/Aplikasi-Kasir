const mongoose = require("mongoose");
const list = [
    "./discounts/discount-schema"
]

function init(){
    mongoose.connect(process.env.MONGO_URI).then(r => {
        for(const schemaPath of list){
            require(schemaPath)(mongoose);
        }
    });
}

module.exports = { init }