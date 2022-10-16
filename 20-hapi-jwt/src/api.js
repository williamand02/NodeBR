const Hapi = require('@hapi/hapi')
const Joi = require('joi');
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/hesoisSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoutes = require('./routes/authRoutes')

const HappiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const HappiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'MEU_SEGREDÃO_123'

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }
    await app.register([
        HappiJwt,
        Vision,
        Inert,
        {
            plugin: HappiSwagger,
            options: swaggerOptions
        }
    ])

    app.validator(Joi);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options:{
        //     expiresIn: 20
        // },
        validate: (dado, request) => {
            //verifica no banco se usuario continuya ativo
            //verifica no banco de usuario continuar pagando
            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())

    ]
    )
    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
    return app
}

module.exports = main()