import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    //steps for registering the user

    //get user detail from frontend
    //validation - not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const {fullName, email, username, password} = req.body;

    //some iterates through every input and checks a certain condn.
    //here in this case it trims any spaces and checks if the field is still empty
    if([fullName, email, username, password].some((field) => field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required")
    }

    //check if the user already exists
    //findOne is a mongodb fn. which finds the first entry with given query and returns it
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //check if avatar exists
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    //uplaod them to cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400, "Avatar file is required");
}

//User is only responsible for talking with db and user.create creates a new entry in the db
//.create() takes data in the form of objects bcoz, its a 
const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase()
})
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})


export {registerUser}