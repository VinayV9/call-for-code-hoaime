const mongoDB = require('mongoose')

const post = mongoDB.Schema({
    fileName : {
        type: String,
        unique: true,
        trim:true
    },
    description: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: ""
    }
})

module.exports = mongoDB.model('Feed', post)
