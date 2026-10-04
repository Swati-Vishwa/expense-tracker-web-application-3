import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
  path: './.env'
})

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening to the port http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error("Couldn't connect to Database", error)
    process.emit(2)
  })