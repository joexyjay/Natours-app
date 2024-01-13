import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface UserInstance extends mongoose.Document {
    name: string;
    email: string;
    photo: string;
    password: string;
    passwordConfirm: string | undefined;
}

const userSchema = new mongoose.Schema<UserInstance>({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        // This only works on CREATE and SAVE!!!
        validate: {
            validator: function (this:UserInstance, el: any) {
                return el === this.password
            },
            message: "Passwords are not the same"
        }
    },
},
{
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next()

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete passwordConfirm field
    this.passwordConfirm = undefined
})

const User = mongoose.model<UserInstance>("User", userSchema);

export default User;