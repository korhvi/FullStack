require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const port = process.env.PORT
const Person = require('./models/person')


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
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => Number(person.id)))
    : 0
  return String(maxId + 1)
}


app.post('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
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
})})


app.get('/api/persons/:id', (request, response) => {
  Person.find({}).then(persons => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})})


app.delete('/api/persons/:id', (request, response) => {
  Person.find({}).then(persons => {
  const id = request.params.id
  const personExists = persons.some(person => person.id === id)

  if (!personExists) {
    return response.status(404).json({
      error: 'Person not found'
    })
  }

  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})})


app.put('/api/persons/:id', (request, response) => {
  Person.find({}).then(persons => {
  const id = request.params.id
  const { name, number } = request.body

  const personIndex = persons.findIndex(person => person.id === id)

  if (personIndex !== -1) {

    persons[personIndex] = {
      id,
      name,
      number,
    }
    response.json(persons[personIndex])
  } else {
    response.status(404).json({
      error: 'Person not found'
    })
  }
})})


app.patch('/api/persons/:id', (request, response) => {
  Person.find({}).then(persons => {
  const id = request.params.id
  const { name, number } = request.body

  const personIndex = persons.findIndex(person => person.id === id)

  if (personIndex !== -1) {
    if (name) persons[personIndex].name = name
    if (number) persons[personIndex].number = number

    response.json(persons[personIndex])
  } else {
    response.status(404).json({
      error: 'Person not found'
    })
  }
})})


app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
  const people = persons.length
  const now = new Date()
  response.send(`<p>Phonebook has info for ${people} people</p> <p>${now}</p>`)
})})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})