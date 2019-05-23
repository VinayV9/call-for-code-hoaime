const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

module.exports = function(req, res, next){
    
    if(!req.headers.authorization) {
        return res.status(401).send('authorization header not found')
    }
    let token = req.headers.authorization
    if(token === 'null') {
        return res.status(401).send('Unauthorized request')    
    }
  
    let payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if(!payload) {
        return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.user
    next()
}
