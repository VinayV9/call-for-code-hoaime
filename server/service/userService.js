
const User = require('../models/user')

let userSvc = {}

userSvc.getProfile = (req, res) => {
    
    let id = req.params.id
    User.findOne({_id : id}, (err, user) => {
        if(err) {
            console.log("ERROR: error fetching user profile"+err)
        }
        res.status(200).send(user)
    })
}

userSvc.updateProfile = (req, res) => {
    
}


module.exports = userSvc