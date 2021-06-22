import {Response} from "express";

const {File, FileMulter} = require('./file.model');

async function upload(req: any, res: Response) {
    const Multer = FileMulter.single('file');
    Multer(req, res, async (err: Error) => {
        if (err)
            return res.status(403).send({message: "error"});
        else {
            const file = req.file;
            const img = await File.create({
                name: `${req.nowTime}.jpg`,
                address: req.imgPath
            })

            if (!file)
                return res.status(403).send({message: "error"});
            else
                return res.send({path: img.address});
        }
    });
}

module.exports = {
    upload
};
