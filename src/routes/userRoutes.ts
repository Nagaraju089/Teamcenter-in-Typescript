import express, { Router } from 'express'
import * as user from '../controllers/userController'
import * as authController from '../controllers/authController'
import { upload } from '../utility/upload'

const router: Router = express.Router()

router.get('/users', authController.protect, authController.isAdmin, user.getUsers);
router.patch('/users/add-photo', authController.protect, upload.single('photo'), user.updatePhoto);
router.post('/addUser', authController.protect, authController.isAdmin, user.generateUuid, upload.single('photo'), user.addUser);
router.get('/users-details', authController.protect, user.userDetails);

export default router