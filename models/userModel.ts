import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface UserInstance extends mongoose.Document {
    name: string;
    email: string;
    photo: string;
    role: string;
    password: string;
    passwordConfirm: string | undefined;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    passwordChangedAt: Date;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createPasswordResetToken(): string;
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword: string, 
    userPassword: string
    ) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(String(this.passwordChangedAt.getTime() / 1000), 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken; 
}

const User = mongoose.model<UserInstance>("User", userSchema);

export default User;