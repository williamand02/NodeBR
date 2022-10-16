const assert = require('assert')
const MongoDb = require('../db/strategies/mongodb/mongodb')
const HeroiSchema = require('../db/strategies/mongodb/schemas/hesoisSchema')
const Context = require('../db/strategies/base/contextStrategy')


const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião Hegro',
    poder: 'flexas'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Mulher Maravilha-${new Date()}`,
    poder: 'Laço'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${new Date()}`,
    poder: 'Velocidade'
}
let MOCK_HEROI_ID = ""

let context = {}
describe('MongoDB Suite de testes', function () {
    before(async () => {
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection, HeroiSchema))
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })
    it('Verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })
    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })
    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, { nome: 'Pernalonga' })

        assert.deepEqual(result.modifiedCount, 1)
    })
    it('remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID)

        assert.deepEqual(result.deletedCount, 1)
    })
});

