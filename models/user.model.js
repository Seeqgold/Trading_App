const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required:true,
        min: 10,
        select: false

    },
    email:{
        type: String,
        required:true,
        unique: true,
        trim:true,
        lowercase: true,
    },
    role:{
        type: String,
        enum:['admin', 'user']
    },
    isActive:{
        type: Boolean,
        default:true,
        select:false,
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps:true
}
);
const User = mongoose.model('User', userSchema);
module.exports = User;