const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    idea:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    user:{
        type:String,
        default:true
    }
});

mongoose.model("ideas",IdeaSchema);