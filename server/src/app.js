import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorHandler.middleware.js"

const app = express()
app.use(cors())
app.use(express.json())

//importing routes
import authRouter from "./routes/auth.route.js"

app.get("/", (req, res) => res.json({ message: "Expense Tracker API running" }));
app.use("/api/auth", authRouter)

app.get('/', (req, res) => {
  res.send('Hello Karma testing')
})

app.use(notFound)
app.use(errorHandler)

export default app