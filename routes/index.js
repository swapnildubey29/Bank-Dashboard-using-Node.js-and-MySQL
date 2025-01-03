const express = require('express')
const router = express.Router()
const { signup, login, verifyJwt, sendOtp, verifyingOtp, resetpassword} = require('../controllers/IndexController')

// Rendering Homepage
router.get('/', (req,res) => {
    res.render('index')
})

// Rendering Signup page
router.get('/signup', (req,res) => {
    res.render('signup')
})

// Rendering Dashboard page
router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

// Rendering Forget password page
router.get('/forgotpassword', (req,res) => {
    res.render('forgotpassword')
})


// -----------------------------------------------------------------------------------------------------------------------------------------------

// Route to Create new user.
router.post('/signup',signup)

// Route to Login
router.post('/login',login)

//Route to verfyJwt
router.post('/verifyJwt',verifyJwt)

//Router to Send OTP
router.post('/sendOtp',sendOtp)

//Router to Verify OTP
router.post('/verifyingOtp',verifyingOtp)

//Router to Reset password
router.post('/resetpassword', resetpassword)


module.exports = router