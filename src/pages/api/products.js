import initDB from "helpers/initDB";
import Product from "models/Product";
initDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getAllProduct(req, res);
      break;
    case "POST":
      await saveProduct(req, res);
      break;
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find() // Async Await Syntax
    res.status(200).json(products);

    // Product.find().then((product) => {
    //   res.status(200).json(product);
    // }); 
    // Promise syntax
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
const saveProduct = async (req, res) => {
  try {
    const { name, price, description, mediaUrl } = req.body;
    // console.log(name, price, description, mediaUrl);
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl,
    }).save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
