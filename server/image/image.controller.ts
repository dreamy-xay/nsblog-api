import { Request, Response } from 'express'

const Multer = require('multer')
const FormData = require('form-data')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const config = require('../../app/config')
// const db = require('../../app/db')

const imgMulter = Multer({
  storage: Multer.diskStorage({
    destination(req: any, res: any, cb: any) {
      req.nowTime = Date.now()
      req.imgPath = path.join(__dirname, config.upload.publicPath + config.upload.storeTo)
      fs.mkdirSync(req.imgPath, {recursive: true});
      cb(null, req.imgPath);
    },
    filename(req: any, res: any, cb: any) {
      cb(null, `${req.nowTime}.jpg`);
    }
  }),
  // storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024, // 文件大小 单位 b
    files: 1 // 文件数量
  },
  // fileFilter(req: any, file: any, cb: any) {
  //   if (file.mimetype === 'image/png') {
  //     cb(null, true);
  //   } else if (file.mimetype === 'image/jpg') {
  //     cb(null, true);
  //   } else if (file.mimetype === 'image/jpeg') {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //   }
  // }
})

function upload(req: any, res: Response) {
  const multer = imgMulter.single('image')
  multer(req, res, async (err: Error) => {
    if (err) {
      return res.status(403).send({
        error: err
      })
    } else {
      console.log(req.file.path)
      const form = new FormData()
      form.append('smfile', fs.createReadStream(req.file.path))
      // console.log(fs.createReadStream(req.file.path))
      // form.append('smfile', req.file.buffer)
      // console.log(req.file.buffer)
      const result = await axios.post(
        'https://sm.ms/api/v2/upload',
        form,
        {
          headers: {
            ...form.getHeaders(),
            "Authorization": config.smmsKey
          }
        })

      fs.unlinkSync(req.file.path)

      if (result.data.code === 'image_repeated') {
        // result.data.images
      }
      console.log(result)
    }
  })
}

module.exports = {
  upload
}
