import config from "./utils/config.js"
import express from "express"
import cors from "cors"
import notesRouter from "./controllers/notes.js"
import middleware from "./utils/middleware.js"
import logger from "./utils/logger.js"
import mongoose from "mongoose"
const app = express()

mongoose.set("strictQuery", false)

logger.info("connecting to", config.MONGODB_URI)

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB")
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB:", error.message)
	})

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))
app.use(middleware.requestLogger)

app.use("/api/notes", notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
