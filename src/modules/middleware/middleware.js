const { generateToken, verifyToken } = require('./token-handler')

function handleAuth(req, res, next){
    if(req.originalUrl !== "/api/employees/login"){
        if(!verifyToken(req.headers['authorization'])){
            return res.status(401).json({message: "Unauthorized token"});
        }
    }
    next();
}

function newToken(email){
    return generateToken(email)
}

module.exports = { handleAuth, newToken }