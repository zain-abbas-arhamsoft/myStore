import initDB from "helpers/initDB";
import User from "models/User";
import bcrypt from "bcryptjs";
import Cart from "models/Cart";

initDB();
export default async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name, email, password);
    if (!name || !email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const checkUserEmail = await User.findOne({ email: email });
    if (checkUserEmail)
      return res
        .status(400)
        .json({ error: "User already exists wih this email" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    // console.log("user created", user);
    const cart = await new Cart({ userId: user._id });
    await cart.save();
    // console.log("cart created", cart);
    res
      .status(200)
      .json({ data: user, message: "User saved successfully", Cart: cart });
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
