const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const message = require("../../config/sms");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// get register
const loadRegister = async (req, res) => {
  try {
    res.render("user/register");
  } catch (error) {
    console.log(error.message);
  }
};

// post register
const insertUser = async (req, res, next) => {
  try {
    console.log(req.body.email, "jkjkjk");

    const email = req.body.email;
    const mobile = req.body.mobile;
    const name = req.body.name;

    const password = req.body.password;
    if (!email || !mobile || !name || !password) {
      return res.render("user/register", {
        message: "Please fill in all the fields",
      });
    }

    const existMail = await User.findOne({ email: email });
    // const existnumber = await User.findOne({ email: email });

    if (existMail) {
      res.render("user/register", { message: "this user already exists" });
    } else {
      req.session.userData = req.body;

      req.session.mobile = mobile;
      res.redirect("/otp");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// GET OTP PAGE
const loadOtp = async (req, res) => {
  const userData = req.session.userData;

  const mobile = userData.mobile;
  await message.sendMessage(mobile);

  try {
    res.render("user/otp");
  } catch (error) {
    console.log(error.message);
  }
};
// VERIFYOTP
const verifyOtp = async (req, res) => {
  try {
    const userData = req.session.userData;
    const otp = req.body.otp;
    const verified = await message.verifyCode(userData.mobile, otp);
    if (verified) {
      const secure_password = await securePassword(userData.password);
      const user = new User({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: secure_password,
        is_admin: 0,
        is_blocked:1,
      });
      console.log(user);
      const userDataSave = await user.save();
      if (userDataSave) {
        res.redirect("/");
      } else {
        res.render("user/otp", { message: "Registration Failed" });
      }
    } else {
      res.render("user/otp", { message: "invailid otp" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


 const resendOTP = async (req, res) => {
  try {
    const mobileNumber = req.session.mobile;

    // Retrieve user data from session storage
    const userData = req.session.userData;

    if (!userData) {
      res.status(400).json({ message: "Invalid or expired session" });
    }

    // Generate and send new OTP using Twilio

    await message.sendMessage(mobileNumber);

    res.render("verifyOtp", { message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.render("verifyOtp", { message: "Failed to send otp" });
  }
};


// GET LOGIN
const loadLogin = async (req, res) => {
  try {
    res.render("user/login");
  } catch (error) {
    console.log(error.message);
  }
};
// POST LOGIN
const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch && userData.isAdmin === 0) {
        console.log(userData);
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {
        res.render("user/login", {
          message: "email and password is incorrect",
        });
      }
    } else {
      res.render("user/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("user/home");
  } catch (error) {
    console.log(error.message);
  }
};




const userLogout = async (req, res) => {
  try {
    req.session.destroy();

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  insertUser,
  loadRegister,
  loadHome,
  userLogout,
  loadOtp,
  verifyOtp,
  verifyLogin,
  resendOTP
};
