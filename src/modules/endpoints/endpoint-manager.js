const express = require('express')
const app = express();
const route = express.Router();
const list = [
    "./discounts/discounts-endpoint",
    "./products/products-endpoint" 
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