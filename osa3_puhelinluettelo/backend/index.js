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

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})


app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  
  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findOneAndDelete({ _id: id })
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
})



app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const { name, number } = request.body

  Person.findByIdAndUpdate(id, { name, number }, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})