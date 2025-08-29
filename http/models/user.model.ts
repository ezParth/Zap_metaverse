import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {type: String, required: false},
    password: { type: String, required: true },
    Avatar: { type: String },
    AvatarName : { type: String }
})

const User = mongoose.model("User", userSchema)

export default User
