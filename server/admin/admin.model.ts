import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')

const Admin = db.define('admin', {
    // todo
    admin_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    account: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    signature: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    profile: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    Admin
}
