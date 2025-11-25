import {
  findAllMeals,
  findMealById,
  findMealProducts,
  removeMeal,
} from "./meals-model.js";

// For meals:

const getAllMeals = async (req, res) => {
  try {
    const meals = await findAllMeals();
    res.status(200).json({ message: "Meals found", meals });
  } catch (error) {
    res.status(500).json({ message: "Error getting meals" });
  }
};

const getMealById = async (req, res) => {
  try {
    const meal = await findMealById(req.params.id);
    console.log(meal);
    if (meal) {
      res.status(200).json({ message: "Meal found", meal });
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting meal" });
  }
};

const getMealProducts = async (req, res) => {
  try {
    const products = await findMealProducts(req.params.id);
    console.log(products);
    if (products) {
      res.status(200).json({ message: "Meal products found", products });
    } else {
      res.status(404).json({ message: "Meal products not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting meal products" });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await removeMeal(id);
    if (result) {
      res.status(200).json({ message: "Meal deleted", result });
    } else {
      res.status(400).json({ message: "Could not delete meal" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal" });
  }
};

export { getAllMeals, getMealById, getMealProducts, deleteMeal };
