import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {

        username: {
            type : String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

//it's a hook which can be found on middleware section in mongoose website
//when we want to modify data just before it's going to be sent

userSchema.pre("save", async function (next) {
    //check if password is modified or not (cause we only encrypt password when the password is changed)
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//custom methods
userSchema.methods.isPasswordCorrect = async function(password){

    return await bcrypt.compare(password, this.password)
}

//Generate ACCESS Tokens
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIN: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//Generate Refresh Tokens
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);