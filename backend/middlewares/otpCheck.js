const otpCheck = (req, res, next) => {
    const otpCookie = req.cookies.otp_verified;
    if (!otpCookie) {
      return res.status(401).json({ success: false, message: "OTP requis." });
    }
    next();
  };
  
  module.exports = otpCheck;