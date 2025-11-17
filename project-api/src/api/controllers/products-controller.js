import {
  findAllProducts,
  findOneProductById,
  getProductsByCategory,
  getProductsByTag,
  addNewProduct,
  addProductTag,
  removeProductTag,
  modifyProductById,
  removeProduct,
} from "../models/products-model.js";

// GET Controllers:

/**
 * Direct the GET all Products-request to model
 */
const getAllProducts = async (req, res) => {
  try {
    const [products] = await findAllProducts();
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    res.status(500).json({ message: "Error getting products" });
  }
};

/**
 * Direct the GET Product by ID-request to model
 */
const getProductById = async (req, res) => {
  try {
    const [product] = await findOneProductById(req.params.id);
    if (product) {
      res.status(200).json({ message: "Product found", product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting product" });
  }
};

/**
 * Direct the GET all Products by category ID-request to model
 */
const getAllProductsByCategory = async (req, res) => {
  try {
    const [products] = await getProductsByCategory(req.params.categoryId);
    if (products) {
      res.status(200).json({ message: "Products found", products });
    } else {
      res.status(404).json({ message: "Products not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting products" });
  }
};

/**
 * Direct the GET all Products by tag ID-request to model
 */
const getProductsByTagId = async (req, res) => {
  try {
    const [products] = await getProductsByTag(req.params.tagId);
    if (products) {
      res.status(200).json({ message: "Products found", products });
    } else {
      res.status(404).json({ message: "Products not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting products" });
  }
};

/**
 * Direct the POST Product-request to model
 */
const postProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await addNewProduct(newProduct);
    if (result.productId) {
      res.status(200).json({ message: "New product added", result });
    } else {
      res.status(400).json({ message: "Could not add product" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
};

/**
 * Direct the POST tags/:id-request to model
 */
const postProductTag = async (req, res) => {
  try {
    const productId = req.params.productId;
    const tagId = req.body.tag_id;

    const result = await addProductTag(productId, tagId);
    if (result) {
      res.status(200).json({ message: "New tag added for product", result });
    } else {
      res.status(400).json({ message: "Could not add tag for product" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding tag for product" });
  }
};

/**
 * Direct the DELETE tags/:id-request to model
 */
const deleteProductTag = async (req, res) => {
  try {
    const productId = req.params.productId;
    const tagId = req.params.tagId;
    const result = await removeProductTag(productId, tagId);
    if (result) {
      res.status(200).json({ message: "Tag removed from a product", result });
    } else {
      res.status(400).json({ message: "Could not remove a tag from product" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing tag from a product" });
  }
};

/**
 * Direct the PUT Product-request to model
 */
const putProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const newProductInfo = req.body;
    const result = await modifyProductById(productId, newProductInfo);
    if (result.productId) {
      res.status(200).json({ message: "Product info updated", result });
    } else {
      res.status(400).json({ message: "Could not update product" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

/**
 * Direct the DELETE Product-request to model
 */
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await removeProduct(productId);
    console.log(result);
    if (result.productId) {
      res.status(200).json({
        message: "Product deleted",
        result,
      });
    } else {
      res.status(400).json({
        message: "Could not delete product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export {
  getAllProducts,
  getProductById,
  getAllProductsByCategory,
  getProductsByTagId,
  postProduct,
  postProductTag,
  deleteProductTag,
  putProduct,
  deleteProduct,
};
