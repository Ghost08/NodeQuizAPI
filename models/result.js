const mongoose = require("mongoose");

const schema = mongoose.Schema;

const resultSchema = new schema({

    subscriptionId : { type: mongoose.Schema.Types.ObjectId, ref: 'subscription' },
    userId :  { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    quizId : { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
    paperId : { type: mongoose.Schema.Types.ObjectId, ref: 'paper' },
    totalQuestions :Number,
    correctAnswers : Number,
    wrongAnswers :Number,
    score: Number,
    result:String,   
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date


})
module.exports = mongoose.model("result",resultSchema,"results");