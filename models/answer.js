const mongoose = require("mongoose");

const schema = mongoose.Schema;

const answerSchema = new schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'paper' },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
    answerId: String,
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
})

module.exports = mongoose.model("answer",answerSchema,"answers");
