const express = require('express')
const { signup } = require('../controllers/IndexController')
const router = express.Router()

// Rendering Homepage
router.get('/', (req,res) => {
    res.render('index')
})

// Rendering Signup page
router.get('/signup', (req,res) => {
    res.render('signup')
})

// Route to Create new user.
router.post('/signup',signup)

// Route to Login



module.exports = router