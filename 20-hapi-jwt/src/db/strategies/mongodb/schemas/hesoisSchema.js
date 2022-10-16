const Mongoose = require('mongoose')

const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    inserteAt: {
        type: Date,
        default: new Date()
    }
})
module.exports = Mongoose.models.herois || Mongoose.model('herois', heroiSchema)