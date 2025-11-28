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
} from "./products-model.js";

// GET Controllers:

/**
 * Direct the GET all Products-request to model
 */
const getAllProducts = async (req, res, next) => {
  try {
    const products = await findAllProducts();
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    next({ status: 500, message: "Error getting products" });
  }
};

/**
 * Direct the GET Product by ID-request to model
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await findOneProductById(req.params.id);
    if (product) {
      res.status(200).json({ message: "Product found", product });
    } else {
      next({ status: 404, message: "Product not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting product" });
  }
};

/**
 * Direct the GET all Products by category ID-request to model
 */
const getAllProductsByCategory = async (req, res, next) => {
  try {
    const products = await getProductsByCategory(req.params.categoryId);
    if (products) {
      res.status(200).json({ message: "Products found", products });
    } else {
      next({ status: 404, message: "Products not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting products" });
  }
};

/**
 * Direct the GET all Products by tag ID-request to model
 */
const getProductsByTagId = async (req, res, next) => {
  try {
    const products = await getProductsByTag(req.params.tagId);
    if (products) {
      res.status(200).json({ message: "Products found", products });
    } else {
      next({ status: 404, message: "Products not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting products" });
  }
};

/**
 * Direct the POST Product-request to model
 */
const postProduct = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }

    if (!req.body.filename && req.file) {
      req.body.filename = req.file.filename;
    }

    const newProduct = req.body;
    const result = await addNewProduct(newProduct);
    if (result.productId) {
      res.status(200).json({ message: "New product added", result });
    } else {
      next({ status: 400, message: "Could not add product" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding product" });
  }
};

/**
 * Direct the POST tags/:id-request to model
 */
const postProductTag = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const productId = req.params.productId;
    const tagId = req.body.tag_id;

    const result = await addProductTag(productId, tagId);
    if (result) {
      res.status(200).json({ message: "New tag added for product", result });
    } else {
      next({ status: 400, message: "Could not add tag for product" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding tag for product" });
  }
};

/**
 * Direct the DELETE tags/:id-request to model
 */
const deleteProductTag = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const productId = req.params.productId;
    const tagId = req.params.tagId;
    const result = await removeProductTag(productId, tagId);
    if (result) {
      res.status(200).json({ message: "Tag removed from a product", result });
    } else {
      next({ status: 400, message: "Could not remove a tag from product" });
    }
  } catch (error) {
    next({ status: 500, message: "Error removing tag from a product" });
  }
};

/**
 * Direct the PUT Product-request to model
 */
const putProduct = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }

    if (!req.body.filename && req.file) {
      req.body.filename = req.file.filename;
    }

    const productId = req.params.id;
    const newProductInfo = req.body;
    const result = await modifyProductById(productId, newProductInfo);
    if (result.productId) {
      res.status(200).json({ message: "Product info updated", result });
    } else {
      next({ status: 400, message: "Could not update product" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating product" });
  }
};

/**
 * Direct the DELETE Product-request to model
 */
const deleteProduct = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    if (!currentUser) {
      next({ status: 401, message: "Unauthorized" });
      return;
    }
    if (currentUser.role === "user") {
      next({ status: 403, message: "Forbidden" });
      return;
    }
    const productId = req.params.id;
    const result = await removeProduct(productId);
    console.log(result);
    if (result.productId) {
      res.status(200).json({
        message: "Product deleted",
        result,
      });
    } else {
      next({ status: 400, message: "Could not delete product" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting product" });
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
