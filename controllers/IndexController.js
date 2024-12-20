const db = require("../config/db")
const jwt = require("jsonwebtoken")

//Signup
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

    //Generate JWT
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });
    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 1000,
      httpOnly: true,
    });

    res.redirect("/dashboard")
    //  console.log(token)
  });
}

//Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error quering the database:", err);
      return res.status(500).json({ message: "Database error" })
    }

    //Generate JWT
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });
    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 1000,
      httpOnly: true,
    });

    res.redirect("/dashboard")
    // console.log(token)
  });
}

//Verify JWT
const verifyJwt = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "JWT token not provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [decoded.email],
      (err, result) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({
            success: false,
            error: "Database error",
          });
        }

        const user = result[0];
        if (user) {
          return res.json({
            success: true,
            redirect: "/dashboard",
          });
        } else {
          return res.json({
            success: false,
            error: "User not found",
          });
        }
      }
    )
  } catch (error) {
    console.error("Error verifying JWT token:", error.message)
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
}

//Forget Password
const sendOtp = async (req,res) => {
    const email = req.body
    
}

const verifyingOtp = async (req,res) => {

}

module.exports = { signup, login, verifyJwt, sendOtp, verifyingOtp}