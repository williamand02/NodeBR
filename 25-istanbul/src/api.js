const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || 'dev'

ok(env === 'prod' || env === "dev", 'a env é invalida, ou dev ou prod')

const configPath = join(__dirname, './../config', `.env.${env}`)

config({
    path: configPath
})
const Hapi = require('@hapi/hapi')
const Joi = require('joi');
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/hesoisSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoutes = require('./routes/authRoutes')

const UltilRoutes = require('./routes/utilRoutes')
const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const HappiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const HappiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = process.env.JWT_KEY
const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, usuarioSchema))

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
        validate: async (dado, request) => {
            //verifica no banco se usuario continuya ativo
            //verifica no banco de usuario continuar pagando
            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase()
            })
            // console.log(result)
            if (!result) {
                return {
                    isValid: false
                }
            }

            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods()),
        ...mapRoutes(new UltilRoutes(), UltilRoutes.methods())

    ]
    )
    await app.start()
    console.log('Servidor rodando na porta', app.info.port)
    return app
}

module.exports = main()