const { OAuth2Client } = require('google-auth-library')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const auth = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CONSUMER_SECRET,
    "http://localhost:4200"
)

let authSvc = {}

authSvc.checkGoogleUser = (req, res) => {

    auth.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GOOGLE_CLIENT_ID
    }, (err, login) =>{
        if(err){
          console.log("ERROR: "+err)
          res.send(404).send({ message: "error with signin" })
        }
        let payload = login.getPayload()
        let audience = payload.aud
       
        if (audience !== process.env.GOOGLE_CLIENT_ID) {
            throw new Error(err)
        }

        User.findOne({ email: payload['email'] }, (err, user) => {

            if (err) { res.send(404).send({ message: "error with signin" }) }
            if (!user) {
                let newUser = new User({ email: payload['email'], avtar: payload['picture'], username: payload['name'] })
                let token = authSvc.createToken(newUser._id)
            
                newUser.save((err, data) => {
                    if (err) {
                        res.send(404).send({ message: "error with signin" })
                    }
                    let userRes = {
                        token: token, 
                        username: data.username,
                        avtar: data.avtar,
                        email: data.email,
                        id: data._id
                    }
                    res.status(200).send(userRes)
                })
            } else {
                let userRes = { 
                    token : authSvc.createToken(user._id),
                    username: user.username,
                    avtar: user.avtar,
                    email: user.email,
                    id: user._id
                }
                res.status(200).send(userRes)
            }
        })

    })
    
}

authSvc.createToken = (userId) => {
    return jwt.sign({ user: userId }, process.env.JWT_SECRET_KEY)
}

module.exports = authSvc
