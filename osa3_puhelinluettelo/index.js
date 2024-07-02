const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Abramov",
    number: "39-23-6423122"
  }
]

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(express.json())
app.use(express.static('dist'))

morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '-'
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => Number(person.id)))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log('Request Body:', body) // Debugging statement

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (!Array.isArray(persons)) {
    return response.status(500).json({
      error: 'Internal server error'
    });
  }
  
  const existingPerson = persons.find(person => person.name === body.name)
  if (existingPerson) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId().toString(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('x')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  const people = persons.length
  const now = new Date()
  response.send(`<p>Phonebook has info for ${people} people</p> <p>${now} </p>`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
