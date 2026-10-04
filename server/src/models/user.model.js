import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    trim: true
  },
  password: {
    type: String,
    require: true,
    unique: true,
    minlength: [6, "Password must be at least 6 characters"]
  }
}, {timestamps: true});

userSchema.pre('save', async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)