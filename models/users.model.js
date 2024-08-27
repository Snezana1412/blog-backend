import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'guest'],
        default: 'user'
    },

    pass_changed_at: {
        type: Date
    },

    register_at: {
        type: Date,
        default: Date.now()
    },

    is_activated: {
        type: Boolean,
        default: false
    }
});




/* middleware for hashing the password */
userSchema.pre('save', async function(next){
    try {
        if(!this.isModified('password')){
            next()
        }
        
        // hash the apssword with bcrypt
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(this.password)
        this.pass_changed_at = Date.now();
        next();
    } catch (error) {
        next(error)
    }
});


// method to compare plain password with hash value
userSchema.methods.comparePass = async function(plainPassword){
    return await bcrypt.compare(plainPassword, this.password)
}


const User = model('User', userSchema);
export default User;