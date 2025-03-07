import express from "express"

const app = express()

let notes = [
	{ id: "1", content: "HTML is easy", important: true },
	{ id: "2", content: "Browser can execute only JavaScript", important: false },
	{
		id: "3",
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true,
	},
]

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method)
	console.log("Path:  ", request.path)
	console.log("Body:  ", request.body)
	console.log("---")
	next()
}

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

app.get("/", (req, res) => {
	res.send("<h1>Hello from express server!<h1/>")
})

app.get("/api/notes", (req, res) => {
	res.json(notes)
})

app.get("/api/notes/:id", (req, res) => {
	const id = req.params.id
	const note = notes.find((note) => note.id === id)
	if (note) {
		res.json(note)
	} else {
		res.status(404).send({ error: "Note not found" })
	}
})

app.post("/api/notes", (req, res) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).send({ error: "content missing" })
	}

	const note = {
		content: body.content,
		important: body.important || false,
		id: crypto.randomUUID(),
	}

	notes = notes.concat(note)

	res.json(note)
})

app.delete("/api/notes/:id", (req, res) => {
	const id = req.params.id
	notes = notes.filter((note) => note.id !== id)
	res.status(204).end()
})

app.use(unknownEndpoint)

const PORT = 8080

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})
