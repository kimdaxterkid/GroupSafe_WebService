/**
 * Created by sungh on 10/2/2016.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var groupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
        unique: true
    },
    members:
        //later change [String] to [{type: Schema.ObjectId, ref: 'Groups'}]
        [{
            firstName : String,
            lastName : String,
            username : String,
            phoneNumber : Number
        }]
    ,
    range : {
        type : Number,
        required : true
    },
    host : {
        type : String,
        required : true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Groups = mongoose.model('Group', groupSchema);

// make this available to our Node applications
module.exports = Groups;