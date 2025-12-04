import { findAllLocations, findLocationById } from "./locations-model.js";

/**
 * Direct the GET all locations-request to model
 */
const getAllLocations = async (req, res, next) => {
  try {
    const locations = await findAllLocations();
    res.status(200).json({ message: "Locations found", locations });
  } catch (error) {
    //console.log(error);
    next({ status: 500, message: "Error getting locations" });
  }
};

/**
 * Direct the GET location by id-request to model
 */
const getLocationById = async (req, res, next) => {
  try {
    const location = await findLocationById(req.params.id);
    if (location) {
      res.status(200).json({ message: "Location found", location });
    } else {
      next({ status: 404, message: "Location not found" });
    }
  } catch (error) {
    //console.log(error);
    next({ status: 500, message: "Error getting location" });
  }
};

export { getAllLocations, getLocationById };
