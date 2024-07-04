const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '-'
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findOneAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number }  = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
     { new: true, runValidators: true, context:'query' }
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
  })

  app.patch('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const { name, number } = request.body
  
    Person.findByIdAndUpdate(id, { name, number }, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
    })

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const now = new Date()
      response.send(`<p>Phonebook has info for ${count} people</p> <p>${now}</p>`)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})