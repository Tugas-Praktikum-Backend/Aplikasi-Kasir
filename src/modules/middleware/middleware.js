const { generateToken, verifyToken } = require('./token-handler')
const whitelist = [
    {"url": "/api/employees/login", "method": "POST"},
    {"url": "/api/employees/", "method": "POST"}
]

function handleAuth(req, res, next){
    for(const w of whitelist){
        if(w.url === req.originalUrl && req.method === w.method){
            return next()
        }
    }
    if(!verifyToken(req.headers['authorization'])){
        return res.status(401).json({message: "Unauthorized token"});
    }
    return next();
}

function newToken(email){
    return generateToken(email)
}

module.exports = { handleAuth, newToken }