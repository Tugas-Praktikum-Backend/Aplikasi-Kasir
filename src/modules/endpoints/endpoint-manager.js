const express = require('express')
const app = express();
const route = express.Router();
const list = [
    "./discounts/discounts-endpoint",
    "./products/products-endpoint",
    "./customers/customers-endpoint",
<<<<<<< HEAD
    "./employees/employees-endpoint"
=======
    "./shifts/shifts-endpoint"
>>>>>>> 66dfb46e757cbd0e1b1906fb6ef3984e06cf7b11
]
async function init(){
    app.use(express.json());
    app.use('/api', route);

    for(const endpoint of list){
        require(endpoint)(route)
    }

    app.listen(5000, (err) => {
        if(err){
            console.error(err);
            return;
        }
        console.log("Listened at port 5000");
    })
}

module.exports = { init }