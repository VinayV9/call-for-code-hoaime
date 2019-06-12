const multer = require('multer')
const path = require('path')
const Disaster = require('../models/disaster')
const crypto = require('crypto')
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3')
const fs = require('fs')

const visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'nOUfWDYvNDDiUINRm5CCI0dtmV-g7Iww0JyH3Xxg99v8'
})

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

let disasterSvc = {}

disasterSvc.sendImage = (req, res) => {
    let path = `${__dirname}/uploads/images/${req.params.name}`
    res.sendFile(path)
}

disasterSvc.createPost = (req, res) => {
  let userId = req.userId
  
  upload(req, res, async (err) => {
      if(err){
        res.status(404).send(err)
      } else {
        if(req.file == undefined){
          res.status(404).send("file not found")
        } else {
          //get watson visulization data
          const images_file = await fs.createReadStream(`${__dirname}/uploads/images/${req.file.filename}`)
          const classifier_ids = ["DefaultCustomModel_1266334953"]
          const threshold = 0.6
          const params = {
            images_file: images_file,
            classifier_ids: classifier_ids,
            threshold: threshold
          }
          
          visualRecognition.classify(params, function(err, response) {
            if (err) { 
              res.status(404).send("error saving post"+err)
            } else {
                let _class = response.images[0].classifiers[0].classes[0].class
                let score = response.images[0].classifiers[0].classes[0].score
                let disaster = new Disaster({fileName: req.file.filename, log: req.body.log, lat: req.body.lat, userId: userId, class: _class, score: score, date: Date.now()})

                disaster.save((err, post) => {
                    if(err){
                        res.status(404).send("error saving post"+err)
                    }
                    res.status(200).send(post)
                })
            }
          })
        }
      }
  })
}

disasterSvc.getPosts = (req, res) => {
    Disaster.find()
        .then((posts) => {
            res.status(200).send(posts)
        })
        .catch((err) => {
            res.status(404).send("error fetching posts")
        })
}

disasterSvc.disasterAnalysis = (req, res) => {
  let lat = req.body.lat;
  let log = req.body.log;
  let radius = Math.round(2/3963.2)
  let startTime = Date.now(Date.now() - 24*60*60*1000); 
  let endTime = Date.now();
  Disaster.find({
    $and : [ { $or : [ {lat: {$lte : lat + radius}}, {lat: {$gte : lat - radius}} ] } ,
             { $or : [ {log: {$lte : log + radius}}, {log: {$gte : log - radius}} ] },
             { $or : [ {time: {$lte: endTime}}, {time: {$gte: startTime}}]}
           ]
    })
    .then((disasters) => {
      res.status(200).send(disasters)
    })
    .catch((err) => {
      res.status(404).send("error fetching analysis")
    })
}

module.exports = disasterSvc
