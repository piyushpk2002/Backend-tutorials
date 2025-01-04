import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


//This middleware adds user data to the req object before going to logout
export const verifyJWT = asyncHandler(async (req, _, next) => { //Sometimes there is no use of res so we can replace it with _
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
     if(!token){
         throw new ApiError(401, "Unauthorized request")
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("-password -refresToken")
 
     if(!user){
         throw new ApiError(401, "Invalid Access Token")
     }
 
     req.user = user;
     next()
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
   }
    
})