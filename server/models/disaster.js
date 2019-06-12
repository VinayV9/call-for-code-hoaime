const mongoDB = require('mongoose')

const disaster = mongoDB.Schema({
    fileName : {
        type: String,
        unique: true,
        trim:true
    },
    log: {
        type: String,
        default: ""
    },
    lat: {
        type: String,
        default: ""
    },
    class: {
        type: String,
        default: ""
    },
    score: {
        type: String,
        default: ""
    },
    time: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoDB.model('Disaster', disaster)
