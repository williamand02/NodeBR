//npm install sequelize pg-hstore pg
const Sequelize = require('sequelize')
const driver = new Sequelize(
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

async function main() {
    const Herois = driver.define('herois', {
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
    await Herois.sync()
    await Herois.create({
        nome: 'Lanterna Verde',
        poder: 'Anel'
    })

    const result = await Herois.findAll({ raw: true })
    console.log({ result })
}

main()