const mongoose = require("mongoose");

const schema = mongoose.Schema;


const options = new schema({
    optionId: Number,
    optionTitle: String,
    optionDesc: String,
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date

})

const questionSchema = new schema({
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'paper' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
    questionTitle: String,
    questionDesc: String,
    active: Boolean,
    options: [options],
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
});


module.exports = mongoose.model("question", questionSchema, "questions");