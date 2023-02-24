import initDB from "helpers/initDB";
import User from "models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
initDB();
export default async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    if (!email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(404)
        .json({ error: "User don't exists wih this email" });
    const doMatch = await bcrypt.compare(password, user.password);
    // console.log(doMatch);
    if (doMatch) {
      const token = await jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      // console.log("user", user);
      const { name, role, email } = user;
      res.status(200).json({
        data: user,
        token: token,
        message: "Login successfully",
        user: { name, role, email },
      });
    } else {
      return res.status(404).json({ error: "password mismatch" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
