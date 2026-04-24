const jwt = require('jsonwebtoken')
const secretKey = 'sadjkadadjerjadnsjafa'

function generateToken(email){
    const payload = { email, timestamp: Date.now() }
    return jwt.sign(payload, secretKey, {
        expiresIn: '1d'
    })
}

function verifyToken(token){
    if(!token)return null;
    try {
        return jwt.verify(token, secretKey, (err, decoded) => {
            return !!decoded;
        });
    } catch(err){
        return null;
    }
}

module.exports = { generateToken, verifyToken }