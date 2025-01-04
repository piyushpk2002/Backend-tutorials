import { Router } from "express";
import { logoutUser, registerUser, loginUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    //multer middleware for file upload i.e before going to userController upload the file in local storage
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser

)

router.route("/login").post(loginUser)

//secred routes
router.route("/logout").post(verifyJWT, logoutUser)

export default router;