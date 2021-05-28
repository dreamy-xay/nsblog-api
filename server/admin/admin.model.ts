import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')

const Admin = db.define('admin', {
    admin_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    account: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    email: Sequelize.STRING(20),
    avatar: Sequelize.STRING(20),
    signature: Sequelize.STRING(100),
    profile: Sequelize.TEXT,
}, {
    freezeTableName: true,
    timestamps: false
})

const Setting = db.define('setting', {
    log_limit_time: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 30
    },
    article_history_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 30
    },
    theme: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    Admin,
    Setting
}
