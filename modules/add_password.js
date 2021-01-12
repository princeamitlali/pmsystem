const mongoose = require('mongoose')
var mongopaginate = require('mongoose-paginate')
const { schema } = require('./user')

mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true, useCreateIndex:true,useUnifiedTopology: true})

var conn = mongoose.Collection

var passSchema = new mongoose.Schema({
    password_category: {
        type:String,
        required:true,
        
    },
    project_name: {
        type:String,

    },
    password_details: {
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }

})

passSchema.plugin(mongopaginate)

var passDetailsModel = mongoose.model('password_details',passSchema)

module.exports=passDetailsModel