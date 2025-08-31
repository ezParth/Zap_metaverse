import express from "express"
import cors from "cors"
import userRouter from "./router/user.router"
import adminRouter from "./router/admin.router"
import { connectDB } from "./database/ConnectDB"
import { Server } from "socket.io"
import http from "http"

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
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
      },
})

const users = new Map()

io.on("connection", (socket) => {
    console.log("A user connected", socket.id)

    socket.emit("current-users", Array.from(users.values()));

    users.set(socket.id, { x: 1, y: 1, userId: socket.id });

    users.forEach((user) => {
        console.log("-> ", user)
    })

    socket.broadcast.emit('user-joined', {
        x: 1,
        y: 1,
        userId: socket.id
    })

    socket.on("move", (payload) => {
        console.log("payload of user moved: ", payload)
        users.set(payload.userId, payload);
        socket.broadcast.emit("user-moved", payload)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit("user-left", socket.id)
        users.delete(socket.id)
    })

    socket.on('message', (message) => {
        console.log("message: ", message)
        socket.broadcast.emit("recieve-message", {message: message, userId: socket.id})
    })
})

server.listen(3000, () => {
    console.log("Server running on port 3000")
})
