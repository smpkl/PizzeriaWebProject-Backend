import {
  findAllFeedbacks,
  findFeedbackById,
  findFeedbacksByUserId,
  addNewFeedback,
  modifyFeedbackById,
  removeFeedback,
} from "./feedbacks-model.js";

const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await findAllFeedbacks();
    res.status(200).json({ message: "Feedbacks found", feedbacks });
  } catch (error) {
    next({ status: 500, message: "Error getting feedbacks" });
  }
};

const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await findFeedbackById(req.params.id);
    if (feedback) {
      res.status(200).json({ message: "Feedback found", feedback });
    } else {
      next({ status: 404, message: "Feedback not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting feedback" });
  }
};

const getAllUsersFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await findFeedbacksByUserId(req.params.id);
    if (feedbacks) {
      res.status(200).json({ message: "User feedback found", feedbacks });
    } else {
      next({ status: 404, message: "User feedbacks not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting user feedbacks" });
  }
};

const addFeedback = async (req, res, next) => {
  try {
    const newFeedbackAdded = await addNewFeedback(req.body);
    if (newFeedbackAdded) {
      res.status(201).json({ message: "New feedback added successfully" });
    } else {
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error adding new feedback" });
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const updateComplete = await modifyFeedbackById(req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Update was successfull" });
    } else {
      next({ status: 400, message: "Check your request" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating feedback" });
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await removeFeedback(id);
    if (result) {
      res.status(200).json({ message: "Feedback deleted", result });
    } else {
      next({ status: 400, message: "Could not delete feedback" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting feedback" });
  }
};

export {
  getAllFeedbacks,
  getFeedbackById,
  getAllUsersFeedbacks,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
