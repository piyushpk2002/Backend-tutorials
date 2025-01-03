import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

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

export default router;