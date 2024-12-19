const db = require("../config/db")

const signup = async (req, res) => {
  // console.log('Signup route hit');
  const { name, email, password, confirmpassword } = req.body;
  // console.log('Data received:', { name, email, password });
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err)
      return res.status(500).send("Error saving data to database")
    }
    res.redirect("/dashboard");
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error quering the database:", err)
      return res.status(500).json({ message: "Database error" })
    }
    res.redirect("/dashboard")
  });
};

module.exports = { signup, login }