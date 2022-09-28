const ICrud = require("./interfaces/interfaceCrud")

const Sequelize = require('sequelize')


class Postgres extends ICrud {
    constructor(strategy) {
        super()
        this._driver = null
        this._herois = null
    }
    async isConnected() {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.log('fail!', error)
            return false
        }

    }
    async defineModel() {
        this._herois = this._driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'TB_HEROIS',
            freezeTab: false,
            timestamps: false

        })
        await this._herois.sync()

    }
    async connect() {
        this._driver = new Sequelize(
            'heroes',
            'root',
            'root',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatosAliases: false
            }
        )
        await this.defineModel()
    }
    async create(item) {
        const {
            dataValues
        } = await this._herois.create(item)
        return dataValues
    }
    async update(id, item) {
        console.log("id", id)
        console.log({ item })
        return this._herois.update(item, { where: { id: id } })
    }
    async read(item = {}) {
        return this._herois.findAll({ where: item, raw: true })
    }
    async delete(id) {
        const query = id ? { id } : {}
        return this._herois.destroy({ where: query })
    }

}

module.exports = Postgres