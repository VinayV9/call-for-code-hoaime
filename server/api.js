const express = require('express')
const router = express.Router()
const authSvc = require('./service/authService')
const userSvc = require('./service/userService')
const postSvc = require('./service/postService')
const disasterSvc = require('./service/disasterService')
const tokenCheck = require('./middleware/tokenCheck')

router.post('/auth/google', authSvc.checkGoogleUser)
router.get('/user/profile/:id', userSvc.getProfile)
router.post('/user/post', tokenCheck, postSvc.createPost)
router.get('/posts', postSvc.getPosts)
router.get('/post/image/:name' ,postSvc.sendImage)


router.post('/user/disaster', tokenCheck, disasterSvc.createPost)
router.get('/disasters', disasterSvc.getPosts)
router.get('/disaster/image/:name', disasterSvc.sendImage)
router.post('/analysis/disaster', disasterSvc.disasterAnalysis)

module.exports = router
