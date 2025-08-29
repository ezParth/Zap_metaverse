import express from "express"
import cors from "cors"
import userRouter from "./router/user.router"
import adminRouter from "./router/admin.router"
import { connectDB } from "./database/ConnectDB"

const app = express()

let corsOptions = {
    origin : ['*'],
}  

// parsing middlewares
app.use(express.json())
app.use(cors(corsOptions))

//router
app.use("/api/v1/user", userRouter); 
app.use("/api/v1/admin", adminRouter); 

// database
connectDB()

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
