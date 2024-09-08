import express from 'express'

import { registerUser,loginUser, getUserDetail } from '../Controller/authcontroller.js'
const router= express.Router()

router.post('/login',loginUser)
router.post('/register',registerUser)
router.get('/getuser',getUserDetail)


export default router;
//router.put('/reset-password/:token', resetPassword);
// router.post('/forget-password',forgetPassword)
