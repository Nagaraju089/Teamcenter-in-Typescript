import express, { Router } from 'express'
import * as authController from '../controllers/authController'
import * as productController from '../controllers/productsController'


const router: Router = express.Router()
router.get('/', authController.protect, productController.getAllProducts);
router.get('/:client_id', authController.protect, productController.getProductsByClient);
router.post('/:clientId/add-product', authController.protect, authController.isAdmin, productController.assignProductToClient);


export default router