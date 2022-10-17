const Sequelize = require("sequelize")

const UsuarioSchema = {
    name: 'usuarios',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        }
    },
    option: {
        tableName: 'TB_USUARIOS',
        freezeTab: false,
        timestamps: false
    }
}

module.exports = UsuarioSchema;