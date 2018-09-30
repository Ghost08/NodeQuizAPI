const mongoose = require("mongoose");

const schema = mongoose.Schema;


const answer = new schema({
    questionId: String,
    answerId: String,
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
})

const subscriptionschema = new schema({ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'paper' },
    answers: [answer],
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
   
});

module.exports = mongoose.model("subscription", subscriptionschema, "subscriptions");