import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, reqired: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  quantity: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    requird: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
