import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import Note from "./models/note.js"

const app = express()

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method)
	console.log("Path:  ", request.path)
	console.log("Body:  ", request.body)
	console.log("---")
	next()
}

app.use(express.static("dist"))

app.use(express.json())
app.use(requestLogger)
app.use(cors())

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

app.get("/", (req, res) => {
	res.send("<h1>Hello from express server!<h1/>")
})

app.get("/api/notes", (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

app.get("/api/notes/:id", (req, res, next) => {
	const id = req.params.id
	Note.findById(id)
		.then((note) => {
			if (note) {
				res.json(note)
			} else {
				res.status(404).send({ error: "note not found" })
			}
		})
		.catch((error) => next(error))
})

app.post("/api/notes", (req, res, next) => {
	const body = req.body

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note
		.save()
		.then((savedNote) => {
			res.json(savedNote)
		})
		.catch((error) => next(error))
})

app.put("/api/notes/:id", (req, res, next) => {
	const id = req.params.id
	const { content, important } = req.body

	Note.findByIdAndUpdate(
		id,
		{ content, important },
		{
			new: true,
			runValidators: true,
			context: "query",
		}
	)
		.then((updatedNote) => {
			if (updatedNote) {
				res.json(updatedNote)
			} else {
				res.status(404).send({ error: "note not found" })
			}
		})
		.catch((error) => next(error))
})

app.delete("/api/notes/:id", (req, res, next) => {
	const id = req.params.id
	Note.findByIdAndDelete(id)
		.then((result) => {
			res.status(204).end()
		})
		.catch((error) => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})
