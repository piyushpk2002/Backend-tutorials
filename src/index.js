import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'


dotenv.config({
    path: './env'
})

//app.on(error) becomes active and it keeps on running listening for errors till the server is active.
//should be initialized as soon as possible in the code

app.on("error", (error) => {
    console.log("ERR ", error);
    throw error
})

connectDB()
.then(() => {

    //server starts running only when app.listen() is ran
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })

})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err);
});