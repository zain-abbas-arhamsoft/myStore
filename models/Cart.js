import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const cartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "user",
  },

  products: [
    {
      quantity: { type: Number, default: 1 },
      productId: { type: ObjectId, ref: "product" },
    },
  ],
});
export default mongoose.models.cart || mongoose.model("cart", cartSchema);
