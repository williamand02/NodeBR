const assert = require('assert');
const api = require('./../api')
let app = {}
let MOCK_ID = ''
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTY2NTg3NTk5OX0.RTqrS421oiBrys5-0PUiS9v5skm_DzX96XFsH1f1o9Q'

const headers = {
    Authorization: TOKEN
}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}


function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/herois',
        headers,
        payload: {
            nome: 'Flash',
            poder: 'Velocidade'
        }
    });
}

describe('Suite de testes do API Heroies', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await cadastrar()
        MOCK_ID = JSON.parse(result.payload)._id
    })


    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois'
        })
        const dados = JSON.parse(result.payload)

        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))

    });
    it('listar /herois deve retornar somente 10 registros', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })
    it('listar /herois deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })


        const erroResult = {
            statusCode: 400,
            error: "Bad Request",
            message: '"limit" must be a number',
            validation: { source: "query", keys: ["limit"] },
        }
        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(erroResult))
    })
    it('listar GET - /herois deve filtra um item', async () => {
        const NAME = MOCK_HEROI_CADASTRAR.nome
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome === NAME)
    })
    it('cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/herois`,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })

        const statusCode = result.statusCode
        const {
            message,
            _id
        } = JSON.parse(result.payload)

        assert.ok(statusCode == 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi cadastrado com sucesso!')
    })
    it('atualizar PATCH - /herois/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })
        const statuCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statuCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')
    });
    it('atualizar PATCH - /herois/:id - não deve atualizar com ID incorreto!', async () => {
        const _id = `633de7b24c48cd7242c5c39f`

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify({
                poder: 'Super Mira'
            })
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id Não encontrado no banco'
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    });
    it('remover DELETE - /herois/:id', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers,
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi Removido com sucesso!')
    })
    it('remover DELETE - /herois/:id não deve remover', async () => {
        const _id = `633de7b24c48cd7242c5c39f`

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers,
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id Não encontrado no banco'
        }

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })
    it('remover DELETE - /herois/:id não deve remover com id invalido', async () => {
        const _id = 'ID_INVALIDO'

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers,
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: "Internal Server Error",
            message: "An internal server error occurred"
        }

        assert.ok(statusCode === 500)
        assert.deepEqual(dados, expected)
    })
})