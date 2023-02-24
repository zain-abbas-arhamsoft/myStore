import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import Cart from "models/Cart";
import jwt from "jsonwebtoken";
import Order from "models/Order";
import initDB from "helpers/initDB";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
initDB();
export default async (req, res) => {
  const { paymentInfo } = req.body;
  // console.log("paymentInfo", paymentInfo);
  const { authorization } = req.headers;
  // console.log("authorization...", authorization);
  if (!authorization) {
    res
      .status(403)
      .json({ error: "you must be logged in to access this page" });
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    // console.log("userId", userId);
    const cart = await Cart.findOne({ userId: userId }).populate(
      "products.productId"
    );
    // console.log("cart.products", cart.products);
    let price = 0;
    cart.products.map((item) => {
      price = price + item.quantity * item.productId.price;
      console.log("price", price);
    });
    const prevCustomer = await stripe.customers.list({
      email: paymentInfo.email,
    });
    // console.log("prevCustomer", prevCustomer);
    const isExsistingCustomer = prevCustomer.data.length > 0;
    // console.log("isExsistingCustomer", isExsistingCustomer);

    if (!isExsistingCustomer) {
      var newCustomer = await stripe.customers.create({
        email: paymentInfo.email,
        source: paymentInfo.id,
      });
      // console.log("newCustomer", newCustomer);
    }
    // console.log("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
    const charge = await stripe.charges.create(
      {
        currency: "USD",
        amount: price,
        receipt_email: paymentInfo.email,
        customer: isExsistingCustomer
          ? prevCustomer.data[0]?.id
          : newCustomer?.id,
        description: `you purchased a product | ${paymentInfo.email}`,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    // console.log("charge", charge);
    // console.log("cart._id", cart._id);
    const newOrder = await new Order({
      userId: userId,
      email: paymentInfo.email,
      total: price,
      products: cart.products,
    }).save();
    // console.log("newOrder", newOrder);
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $set: { products: [] } }
    );
    // console.log("updatedCart", updatedCart);
    res.status(200).json({ message: "Payment was successful" });
  } catch (err) {
    res.status(403).json({ error: "error processing payment" });
  }
};
