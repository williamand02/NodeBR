const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {

    constructor(db) {
        super()
        this.db = db
    }
    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                try {
                    let { skip, limit, nome } = request.query
                    let query = {}
                    if (nome) { query.nome = nome }
                    limit = limit ? parseInt(limit) : 10
                    skip = skip ? parseInt(skip) : 0

                    return this.db.read(query, skip, limit)
                } catch (error) {
                    console.log('DEU RUIM', error)
                    return 'Erro interno no servidor'
                }
            }
        }
    }

}

module.exports = HeroRoutes