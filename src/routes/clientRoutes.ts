import express, { Router } from 'express'
import * as clientsController from '../controllers/clientsController'
import * as authController from '../controllers/authController'

const router: Router = express.Router()

router.get('/', authController.protect, clientsController.getClients);
router.post('/add-client', authController.protect, authController.isAdmin, clientsController.addClients);

export default router