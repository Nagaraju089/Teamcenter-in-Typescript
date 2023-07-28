import express, {Router} from 'express'
//const  authController = require('../controllers/authController')
import * as auth from '../controllers/authController'
//const router = express.Router();
const router: Router = express.Router()

router.post('/send', auth.sendOTP);
router.post('/verify', auth.verifyOTP);
router.post('/resend',auth.resendOtp )
// router.get('/logout', authController.logout);

export default router