const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    joinDate: { 
        type: Date, 
        default: Date.now 
    },
    profileDescription: String,
    profilePicture: String,
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // or the correct collection name
    }],
    followed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // or the correct collection name
      }]
});


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});


module.exports = mongoose.model('User', userSchema);
