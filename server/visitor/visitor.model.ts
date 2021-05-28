import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')
const {Article} = require('../article/article.model')

const Visitor = db.define('visitor', {
    visitor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    avatar: Sequelize.STRING(50),
    signature: Sequelize.STRING(100),
    profile: Sequelize.TEXT,
    register_time: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false
})

const Evaluate = db.define('evaluate', {
    visitor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Visitor,
            key: 'visitor_id',
        }
    },
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    //TODO
    type: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const Subscribe = db.define('subscribe', {
    visitor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Visitor,
            key: 'visitor_id',
        }
    },
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    remark: Sequelize.STRING(100),
}, {
    freezeTableName: true,
    timestamps: false
})

const Browsing_history = db.define('browsing_history', {
    visitor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Visitor,
            key: 'visitor_id',
        }
    },
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    latest_browsing_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    Visitor,
    Browsing_history,
    Subscribe,
    Evaluate
}
