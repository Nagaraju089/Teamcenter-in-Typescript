import express, { Router } from 'express'
import * as auth from '../controllers/authController'
const router: Router = express.Router()

router.post('/send', auth.sendOTP);
router.post('/verify', auth.verifyOTP);
router.post('/resend', auth.resendOtp)
router.get('/logout', auth.logout);

export default router