import {
  findAllDailymeals,
  findDailymealByDay,
  modifyDailymealByDay,
} from "./dailymeals-model.js";

/**
 * Direct the GET all dailymeals-request to model
 */
const getAllDailymeals = async (req, res, next) => {
  try {
    const dailymeals = await findAllDailymeals();
    res.status(200).json({ message: "Daily meals found", dailymeals });
  } catch (error) {
    //console.log(error);
    next({ status: 500, message: "Error getting daily meals" });
  }
};

/**
 * Direct the GET dailymeal by day-request to model
 */
const getDailymealByDay = async (req, res, next) => {
  try {
    const dailymeal = await findDailymealByDay(req.params.day);
    if (dailymeal) {
      res.status(200).json({ message: "Daily meal found", dailymeal });
    } else {
      next({ status: 404, message: "Dailymeal not found" });
    }
  } catch (error) {
    //console.log(error);
    next({ status: 500, message: "Error getting daily meal" });
  }
};

/**
 * Direct the PUT dailymeal-request to model
 */
const putDailymeal = async (req, res, next) => {
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
    const day = req.params.day;
    const mealInfo = req.body;
    const result = await modifyDailymealByDay(day, mealInfo);
    if (result) {
      res.status(200).json({ message: "Daily meal updated", result });
    } else {
      //console.log(error);
      next({ status: 400, message: "Could not update daily meal" });
    }
  } catch (error) {
    //console.log(error);
    next({ status: 500, message: "Error updating daily meal" });
  }
};

export { getAllDailymeals, getDailymealByDay, putDailymeal };
