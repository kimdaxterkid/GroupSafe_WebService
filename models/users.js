/**
 * Created by Song on 10/7/2016.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
// var group = require('../models/groups');

// create a schema
var userSchema = new Schema(
{
    local : {
        username: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type        :String,
            required    :   true,
            unique      :   true
        },
        firstName : {
            type: String,
            required: true
        },
        lastName : {
            type : String,
            required : true
        },
        password: {
            type : String,
            required: true
        },
        groups: {
            type : [{type: Schema.ObjectId, ref: 'Groups'}],
            default:[]
        }
    }
}, 
{
    timestamps: true
}
);

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// the schema is useless so far
// we need to create a model using it
var Users = mongoose.model('User', userSchema);

// Defining object inside an object example
// var TaskSchema = new Schema({
//     name            : String,
//     lastPerformed   : Date,
//     folder          : String,
//     user            : {
//         name        : String,
//         app_key     : String,
//         app_secret  : String
//     }
// })
module.exports = Users;