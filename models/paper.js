const mongoose = require("mongoose");

const schema = mongoose.Schema;


const paperSchema = new schema({
    quizId:{ type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
    paperTitle: String,
    paperDesc: String,
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
    
});


module.exports = mongoose.model("paper", paperSchema, "papers");