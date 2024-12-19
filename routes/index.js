const express = require('express')
const router = express.Router()
const { signup, login, verifyJwt} = require('../controllers/IndexController')

// Rendering Homepage
router.get('/', (req,res) => {
    res.render('index')
})

// Rendering Signup page
router.get('/signup', (req,res) => {
    res.render('signup')
})

// Rendering to Dashboard
router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

// -----------------------------------------------------------------------------------------------------------------------------------------------

// Route to Create new user.
router.post('/signup',signup)

// Route to Login
router.post('/login',login)

//Route to verfyJwt
router.post('/verifyJwt',verifyJwt)

module.exports = router