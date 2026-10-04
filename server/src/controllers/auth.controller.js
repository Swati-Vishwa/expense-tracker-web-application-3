import { User } from "../models/user.model.js";
import APIerror from "../utils/API-Error.js";
import APIresponse from "../utils/API-Response.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/async-handler.js";

const toUser = (user) => ({ _id: user._id, name: user.name, email: user.email });

//Registeration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body ?? {};
  const existingUser = await User.findOne({
    $or: [{ email }, { name }]
  })
  if (existingUser) {
    throw new APIerror(409, "User with this email or name already exists", [])
  }
  const user = await User.create({ name, email, password })
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) throw new APIerror(500, "Couldn't create user");
  return res
    .status(200)
    .json(
      new APIresponse(201, { user: toUser(createdUser), token: generateToken(user._id)}, "User created successfully")
    )
})

//Login
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body ?? {}
  if(typeof email !== 'string' || typeof password !== 'string' || !email || !password){
    throw new APIerror(400, "Email and password are required")
  }

  const user = await User.findOne({email: email.toLowerCase().trim()}).select("+password")
  // console.log(user)
  if (!user || !(await user.isPasswordCorrect(password))){
    throw new APIerror(401, "Invalid email or password")
  }

  res.json(new APIresponse(200, {user: toUser(user), token: generateToken(user._id)}, "User logged in successfully"))
})

 const getMe = async (req, res) => {
  res.json(new APIresponse(200, {user: toUser(req.user)}, "User fetched"));
};

export { registerUser, loginUser, getMe}