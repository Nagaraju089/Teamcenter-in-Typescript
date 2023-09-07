
import express, { Router } from 'express'
import { upload } from '../utility/upload'
import * as authController from '../controllers/authController'
import * as docController from '../controllers/docController'

const router: Router = express.Router()


router.post('/:clientId/:productId/upload-docs', authController.protect, authController.isAdmin, upload.single('file'), docController.uploadDocs);
router.get('/:clientId/:productId', authController.protect, docController.getDocuments);
router.get('/recents', authController.protect, docController.recentFiles);
router.get('/docs/:docID/download', docController.downloadFiles);

export default router
