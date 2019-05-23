const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(process.env.M_LAB, (err)=>{
    if(err) {
        throw err
    }else{
        console.log("mongodb connected:D")
    }   
})

module.exports = mongoose
