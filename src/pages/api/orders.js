import initDB from "helpers/initDB";
import Order from "models/Order";
import Authenticated from "helpers/Authenticated";
initDB();
export default Authenticated(async (req, res) => {
  const order = await Order.find({ userId: req.userId }).populate(
    "products.productId"
  );
  // console.log("order...", order);
  res.status(200).json(order);
});
