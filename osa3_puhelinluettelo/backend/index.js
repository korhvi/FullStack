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
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  
  const existingPerson = persons.find(person => person.name === name);
  if (existingPerson) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const personExists = persons.some(person => person.id === id)

  if (!personExists) {
    return response.status(404).json({
      error: 'Person not found'
    })
  }

  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const people = persons.length
  const now = new Date()
  response.send(`<p>Phonebook has info for ${people} people</p> <p>${now}</p>`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})