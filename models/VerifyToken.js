const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const verifyTokenSchema = new Schema({
    _userId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const verifyTokenModel = mongoose.model("verifyTokens",verifyTokenSchema);

module.exports = verifyTokenModel;