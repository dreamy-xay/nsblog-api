import Sequelize from "sequelize";

const db: Sequelize.Sequelize = require('../../app/db')

const Article = db.define('article', {
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    //TODO
    review_permission: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    page_view: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    //TODO
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    release_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    content: Sequelize.TEXT,
    //TODO
    access_permission: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    summary: Sequelize.STRING(200),
    sharing_agreement: Sequelize.STRING(50),
    oppose_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    recommend_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    password_protection: Sequelize.STRING(30),
    title: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    cover_image: Sequelize.STRING(50),
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 99999
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const Article_history = db.define('article_history', {
    article_history_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    summary: Sequelize.STRING(200),
    content: Sequelize.TEXT,
    update_time: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false
})

const Article_tag = db.define('article_tag', {
    article_tag_id: {
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
}, {
    freezeTableName: true,
    timestamps: false
})

const A_at = db.define('a_at', {
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    article_tag_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article_tag,
            key: 'article_tag_id',
        }
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const Article_category = db.define('article_category', {
    article_id: {
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
}, {
    freezeTableName: true,
    timestamps: false
})

const A_ac = db.define('a_ac', {
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    article_category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article_category,
            key: 'article_category_id',
        }
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const Friend_chain = db.define('friend_chain', {
    friend_chain_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    url: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false
})

const A_fc = db.define('a_fc', {
    article_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id',
        }
    },
    friend_chain_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Friend_chain,
            key: 'friend_chain_id',
        }
    },
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    Article,
    Article_history,
    Article_category,
    A_ac,
    Article_tag,
    A_at,
    Friend_chain,
    A_fc
}
