const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//require the passport

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        role: String
    }
});

UserSchema.plugin(passportLocalMongoose);
// we use word 'plugin' to pass in the schema that we create to passport local mongoose 
// this will gonna add on a password, an authentication.
module.exports = mongoose.model('User', UserSchema);
//export the schema to main file.