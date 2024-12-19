require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const chalk = require("chalk")
const mysql = require("./config/db")
const app = express()
const routes = require('./routes/index')

//File Configuration
app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/assets',express.static(__dirname + '/views/assets'))
app.use("/",routes)

//Listen
mysql.query("SELECT 1",(err) =>{
    if(err){
        console.err("Error testing MySQL connection:", err.message)
        return;
    }
    console.log(chalk.bgCyan.white("MySQL DB Connected"))

    const port = process.env.PORT
    app.listen(port, () => {
        console.log(chalk.bgMagenta.white(`Server is running on ${port}`))
    })
})