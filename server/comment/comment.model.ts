import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')
const {Article} = require('../article/article.model')
const {Visitor} = require('../visitor/visitor.model')

const Comment = db.define('comment', {
    comment_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    visitor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Visitor,
            key: 'visitor_id',
        }
    },
    reply_id: Sequelize.INTEGER.UNSIGNED,
    parent_id: Sequelize.INTEGER.UNSIGNED,
    content: Sequelize.TEXT,
    time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    Comment
}
