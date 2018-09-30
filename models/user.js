const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
    userName: String,
    password: String,
    firstName: String,
    middleName: String,
    lastName: String,
    email: String,
    role : String,
    active: Boolean,
    createdBy: String,
    createdDate: Date,
    modifiedBy: String,
    modifiedDate: Date
});


module.exports = mongoose.model("user", userSchema, "users");