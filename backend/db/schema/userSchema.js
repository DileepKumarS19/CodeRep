import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

export const UserModel = mongoose.model("User", userSchema);
