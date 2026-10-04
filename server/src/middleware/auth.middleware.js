import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"
import APIerror from "../utils/API-Error.js"

//Check whether the incoming request has a valid JWT
//Identify the user
//Attach that user to req so protected routes can use it.

export const protect = async (req, res, next) => {
  //get bearer token
  const header = req.headers.authorization;
  console.log(header)
  if (!header?.startsWith("Bearer ")) {
    throw new APIerror(401, "Unauthorized")
  }
  let decoded;
  if(!process.env.JWT_SECRET){ 
    console.error("Jwt secret is missing")
    process.emit(1)
  }  
  try {
    //extract and compare token
    decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET)
  } catch (error) {
    throw new APIerror(401, "Unauthorized: Invalid or Expired Token")
  }

  //get user
  const user = await User.findById(decoded.id)
  if (!user) throw new APIerror(401, "User no longer exists");
  //attach user to req
  req.user = user;
  console.log(req.user)
  next();
}