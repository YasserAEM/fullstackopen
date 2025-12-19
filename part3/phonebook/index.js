require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person.js')

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan('tiny', {skip: (req, res) => req.method === "POST"}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {skip: (req, res) => req.method !== "POST"}))


app.get('/api/persons', (request, response) => {
    Person.find().then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${Person.find.length} people</p>
                   <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if (!person) {
                response.status(404).end()
            } else {
                response.json(person)
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save()
        .then(savedPerson => {
        res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body

    Person.findById(req.params.id)
        .then(person => {
            person.name = name
            person.number = number

            person.save().then(updatedPerson => {
                res.json(updatedPerson)
            })
        })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unkown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' })
    } else if (error.name ==='ValidationError') {
        res.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})