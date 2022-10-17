const Sequelize = require("sequelize")

const HeroiSchema = {
    name: 'herois',
    schema: {
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
    },
    option: {
        tableName: 'TB_HEROIS',
        freezeTab: false,
        timestamps: false
    }
}

module.exports = HeroiSchema;