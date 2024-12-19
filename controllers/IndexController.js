const db = require("../config/db")

const signup = async (req,res) => {
    const {name, email, password} = req.body

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

      db.query(query, [name, email, password], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error saving data to database' })
      }
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId })
    });
    
}



module.exports = {signup}