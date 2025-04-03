import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    name :{
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: 5,
        maxLength: 50,
    },
    email :{
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match:[/\S+@\S+\S+\.\S+/,"please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
