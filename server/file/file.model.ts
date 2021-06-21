import Sequelize from "sequelize";

const Multer = require('multer');
const Fs = require('fs');
const Path = require('path');
const db: Sequelize.Sequelize = require('../../app/db')
const config = require('../../app/config')

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

const FileMulter = Multer({
    storage: Multer.diskStorage({
        destination(req: any, res: any, cb: any) {
            req.nowTime = Date.now();
            req.imgPath = `${config.upload.storeTo}${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
            const newPath = Path.join(__dirname, `${config.upload.publicPath}${req.imgPath}`);
            Fs.mkdirSync(newPath, { recursive: true });
            cb(null, newPath);
        },
        filename(req: any, file: any, cb: any) {
            cb(null, `${req.nowTime}.jpg`);
        }
    }),
    limits: {
        fileSize: 1024 * 500,
        files: 1
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpg') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

module.exports = {
    File,
    File_category,
    F_fc,
    FileMulter
}
