import {Request, Response} from "express";

const {File, FileMulter} = require('./file.model');

async function upload(req: Request, res: Response) {
    const Multer = FileMulter.single('file');
    Multer(req, res, async (err: Error) => {
        if (err)
            return res.status(403).json({message: "error"});
        else {
            // @ts-ignore
            const file = req.file;
            const img = await File.create({
                // @ts-ignore
                name: `${req.nowTime}.jpg`,
                // @ts-ignore
                address: req.imgPath
            })

            if (!file)
                return res.status(403).json({message: "error"});
            else
                return res.json({path: img.address});
        }
    });
}

module.exports = {
    upload
};
