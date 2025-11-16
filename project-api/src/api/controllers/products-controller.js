import {
  findAllProducts,
  findOneProductById,
  getProductsByCategory,
  addNewProduct,
  modifyProductById,
} from "../models/products-model.js";

// For products:

const getAllProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    res.status(500).json({ message: "Error getting products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await findOneProductById(req.params.id);
    console.log(product);
    if (product) {
      res.status(200).json({ message: "Product found", product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting meal" });
  }
};

export { getAllProducts, getProductById };
