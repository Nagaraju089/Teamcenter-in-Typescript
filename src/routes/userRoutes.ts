import express, {Router} from 'express'
//const  userController = require('../controllers/userController')
import * as user from '../controllers/userController'
import * as auth from '../controllers/authController'
import {upload} from '../utility/upload'

const router: Router = express.Router()

router.get('/users', auth.protect, user.getUsers);
router.patch('/users/add-photo', auth.protect, upload.single('photo'), user.updatePhoto);
router.post('/addUser', auth.protect,user.generateUuid,  upload.single('photo'),  user.addUser);
router.get('/users-details', auth.protect, user.userDetails);

export default router