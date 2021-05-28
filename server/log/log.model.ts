import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')

const Log = db.define('log', {
    log_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    content: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    Log
}
