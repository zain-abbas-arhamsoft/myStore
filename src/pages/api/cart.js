import Cart from "models/Cart";
import Authenticated from "helpers/Authenticated";
import initDB from "helpers/initDB";
initDB();
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await fetchUserCart(req, res);
      break;
    case "PUT":
      await addToProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};



const addToProduct = Authenticated(async (req, res) => {
  console.log("req.body", req.body);
  const { quantity, productId } = req.body;
  console.log("quantity", quantity);
  console.log("productId", productId);
  console.log("tyoeof productId", typeof productId);
  const cart = await Cart.findOne({ userId: req.userId });
  console.log("cart...", cart);
  console.log("cart.products", cart.products);
  const pExsist = cart.products.some(
    (product) => productId == product.productId
  );
  console.log("pExsist bahar", pExsist);
  if (pExsist) {
    console.log("pExsist", pExsist);
    await Cart.findOneAndUpdate(
      {
        _id: cart._id,
        "products.productId": productId,
      },
      {
        $inc: { "products.$.quantity": quantity },
      }
    );
    res.status(200).json({ message: "Product updated to cart" });
  } else {
    const newProduct = { quantity, productId: productId };
    console.log("newProduct", newProduct);
    const addNewProduct = await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $push: { products: newProduct } }
    );
    console.log("addNewProduct", addNewProduct);
    res.status(200).json({ message: "Product added to cart" });
  }
});

const fetchUserCart = Authenticated(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.userId }).populate(
    "products.productId"
  );
  console.log("cart.products", cart.products);
  res.status(200).json(cart.products);
});

const deleteProduct = Authenticated(async (req, res) => {
  console.log("req.body", req.body);
  const { productId } = req.body;
  console.log("productId", productId);
  const cart = await Cart.findOneAndUpdate(
    { userId: req.userId },
    { $pull: { products: { productId: productId } } },
    { new: true }
  ).populate("products.productId");
  console.log("deleted product", cart.products);
  res.status(200).json(cart.products);
});
