const mongoose = require("mongoose");

const schema = mongoose.Schema;

const quizSchema = new schema({
    quizName: String,
    quizType:String,
    quizDesc : String,
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
});

module.exports = mongoose.model("quiz",quizSchema,"quiz");