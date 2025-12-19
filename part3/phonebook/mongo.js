const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument - optionally add name and phone number as arguments')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.wupodj1.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, {family: 4})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(response => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('phonebook:')
    Person.find().then(response => {
        response.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}