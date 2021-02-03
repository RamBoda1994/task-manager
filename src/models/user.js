const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

//create Schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain the word password');
            }
        }
    },
    age: {
        type: String,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be positive');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {timestamps: true})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Available on instance of User model
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = [...user.tokens, {token}];
    await user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.tokens;
    delete userObject.password;
    delete userObject.avatar;
    return userObject;
}

//Custom method available on User model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

//Mongoose middleware. This function runs before saving the document in DB
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

//Delete the all the tasks created by user when the user deletes his profile
userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;

