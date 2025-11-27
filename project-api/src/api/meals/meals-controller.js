import {
  findAllMeals,
  findMealById,
  findMealProducts,
  addNewMeal,
  modifyMealById,
  removeMeal,
  addMealProduct,
  removeMealProduct,
} from "./meals-model.js";

// For meals:

const getAllMeals = async (req, res, next) => {
  try {
    const meals = await findAllMeals();
    res.status(200).json({ message: "Meals found", meals });
  } catch (error) {
    next({ status: 500, message: "Error getting meals" });
  }
};

const getMealById = async (req, res, next) => {
  try {
    const meal = await findMealById(req.params.id);
    console.log(meal);
    if (meal) {
      res.status(200).json({ message: "Meal found", meal });
    } else {
      next({ status: 404, message: "Meal not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting meal" });
  }
};

const getMealProducts = async (req, res, next) => {
  try {
    const products = await findMealProducts(req.params.id);
    console.log(products);
    if (products) {
      res.status(200).json({ message: "Meal products found", products });
    } else {
      next({ status: 404, message: "Meal products not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting meal products" });
  }
};

/**
 * Direct the POST Meal-request to model
 */
const postMeal = async (req, res, next) => {
  try {
    const newMeal = req.body;
    const result = await addNewMeal(newMeal);
    if (result.productId) {
      res.status(200).json({ message: "New meal added", result });
    } else {
      next({ status: 400, message: "Could not add meal" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding meal" });
  }
};

/**
 * Direct the PUT meals/:id-request to model
 */
const putMeal = async (req, res, next) => {
  try {
    const mealId = req.params.id;
    const newMealInfo = req.body;
    const result = await modifyMealById(mealId, newMealInfo);
    if (result.mealId) {
      res.status(200).json({ message: "Meal info updated", result });
    } else {
      next({ status: 400, message: "Could not update meal" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating meal" });
  }
};

const deleteMeal = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await removeMeal(id);
    if (result) {
      res.status(200).json({ message: "Meal deleted", result });
    } else {
      next({ status: 400, message: "Could not delete meal" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting meal" });
  }
};

/**
 * Direct the POST meals/:id/products-request to model (Add a product to meal)
 */
const postMealProduct = async (req, res, next) => {
  try {
    const mealId = req.params.mealId;
    const productId = req.body.product_id;

    const result = await addMealProduct(productId, mealId);
    if (result) {
      res.status(200).json({ message: "New product added to a meal", result });
    } else {
      next({ status: 400, message: "Could not add product to a meal" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding product to a meal" });
  }
};

/**
 * Direct the DELETE meals/:id/products -request to model (Delete a product from a meal)
 */
const deleteMealProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const tagId = req.params.mealId;
    const result = await removeMealProduct(productId, mealId);
    if (result) {
      res.status(200).json({ message: "Product removed from a meal", result });
    } else {
      next({ status: 400, message: "Could not remove a product from a meal" });
    }
  } catch (error) {
    next({ status: 500, message: "Error removing product from a meal" });
  }
};

export {
  getAllMeals,
  getMealById,
  getMealProducts,
  deleteMeal,
  postMeal,
  putMeal,
  postMealProduct,
  deleteMealProduct,
};
