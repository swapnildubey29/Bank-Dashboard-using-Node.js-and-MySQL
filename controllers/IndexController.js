const db = require("../config/db")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

//Signup
const signup = async (req, res) => {
  // console.log('Signup route hit');
  const { name, email, password, confirmpassword } = req.body;
  // console.log('Data received:', { name, email, password });
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Error saving data to database");
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
};

//Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error quering the database:", err)
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
};

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
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [decoded.email],
      (err, result) => {
        if (err) {
          console.error("Database error:", err.message)
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
    );
  } catch (error) {
    console.error("Error verifying JWT token:", error.message)
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

//Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
};

//Forget Password
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  const otp = generateOtp();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    debug: true,
  });

  const mailOption = {
    from: '"ABC-BANK" <ABC-bank@gmail.com>',
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOption)
    console.log(`OTP sent to ${email}: ${otp}`)

    const query = `
      INSERT INTO resetotp (email, otp)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE otp = VALUES(otp);
    `;

    db.query(query, [email, otp], (err) => {
      if (err){
        console.error("Database error while storing OTP:", err)
        return res.status(500).json({ message: "Failed to store OTP", error: err })
      }
      res.status(200).json({ response: 'OTP sent successfully' });
    })
  } catch (error) {
    console.error("Error Sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error })
  }
};

const verifyingOtp = async (req, res) => {
     const otp = req.body
     console.log(otp)


}

module.exports = { signup, login, verifyJwt, sendOtp, verifyingOtp };