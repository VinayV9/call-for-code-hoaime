const mongoDB = require('mongoose')

const user = mongoDB.Schema({
    username : {
        type: String,
        required: [true, "username is required"]
    },
    avtar:{
        type: String,
        required: [true, "image url required"],
        default: "https://www.w3schools.com/w3images/avatar6.png"
    },
    email : {
        type: String,
        unique: true,
        trim:true,
        required: [true, "email is required"]
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    package: {
        type: Number,
        default: ""
    }
})

module.exports = mongoDB.model('User', user)
