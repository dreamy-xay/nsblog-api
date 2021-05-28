import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')

const File = db.define('file', {
    file_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const File_category = db.define('file_category', {
    file_category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
    },
    //TODO
    flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const F_fc = db.define('f_fc', {
    file_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: File,
            key: 'file_id',
        }
    },
    file_category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: File_category,
            key: 'file_category_id',
        }
    },
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    File,
    File_category,
    F_fc
}
