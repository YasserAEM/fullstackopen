const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, {family: 4})
    .then(response => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error while connecting to MongoDB:', error.message)
    })

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: (number => {
                return /^\d{2,3}-\d*$/.test(number)
            }),
            message: props => `${props.value} is not a valid phone number.`
        }
    }
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)