const multer = require('multer')
const path = require('path')
const Post = require('../models/post')
const crypto = require('crypto')

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: `${__dirname}/uploads/images`,
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) return cb(err)
        console.log('inside crypto')
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
})

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('image');

let postSvc = {}

postSvc.sendImage = (req, res) => {
    let path = `${__dirname}/uploads/images/${req.params.name}`
    res.sendFile(path)
}

postSvc.createPost = (req, res) => {
  let userId = req.userId
  
  upload(req, res, (err) => {
      console.log(req.file)
      if(err){
        res.status(404).send(err)
      } else {
        if(req.file == undefined){
          res.status(404).send("file not found")
        } else {
          let post = new Post({fileName: req.file.filename, description: req.body.description, userId: userId})
          post.save((err, post) => {
            if(err){
                res.status(404).send("error saving post"+err)
            }
            res.status(200).send(post)
            })
        }
      }
  })
}

postSvc.getPosts = (req, res) => {
    console.log("hello world")
    Post.find()
        .then((posts) => {
            res.status(200).send(posts)
        })
        .catch((err) => {
            res.status(404).send("error fetching posts")
        })
}

module.exports = postSvc
