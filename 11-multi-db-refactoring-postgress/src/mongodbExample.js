const Mongoose = require('mongoose')
Mongoose.connect('mongodb://userWilliam:userSenha@localhost:27017/herois',
    { useNewUrlParser: true }, function (error) {
        if (!error) return;
        console.log('Falha na conexão', error)
    }
)

const connect = Mongoose.connection

connect.once('open', () => console.log('database rodando!!'))
setTimeout(() => {
    const state = connect.readyState

    console.log(state)
}, 1000);

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
const model = Mongoose.model('herois', heroiSchema)

async function main() {
    // const resultCadastrar = await model.create({
    //     nome: 'Batman',
    //     poder: 'Dinheiro'
    // })
    // console.log('result cadastrar', resultCadastrar)

    const listItens = await model.find({}, { nome: 1, _id: 0 })
    console.log('item', listItens)
}
main()