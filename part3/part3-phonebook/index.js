const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')


morgan.token('postData', function(res) { // this part will be added if this condition of POST matched and so showing in console log
//this postData added logger with this custom token function
  if (res.method === 'POST') {
    return JSON.stringify(res.body)
  } else {return ''}
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
//here we put the tiny format manually bcz custom token(postData) will not work with it
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(
    `Phonebook has info for ${String(persons.length)}<br/><br/>${new Date()}`
  )
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => {
    return person.id === id
  })
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name/number missing',
    })
  } else if (body.name === persons.name) {
    return response.status(400).json({
      error: 'the new name has been used already',
    })
  }
  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
