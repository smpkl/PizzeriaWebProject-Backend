import {
  findAllFeedbacks,
  findFeedbackById,
  findFeedbacksByUserId,
  addNewFeedback,
  modifyFeedbackById,
} from "../models/feedbacks-model";

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await findAllFeedbacks();
    res.status(200).json({ message: "Orders found", feedbacks });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await findFeedbackById(req.params.id);
    if (feedback) {
      res.status(200).json({ message: "Order found", feedback });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting order" });
  }
};

const getAllUsersFeedbacks = async (req, res) => {
  try {
    const feedbacks = await findFeedbacksByUserId(req.params.id);
    if (feedbacks) {
      res.status(200).json({ message: "User orders found", feedbacks });
    } else {
      res.status(404).json({ message: "User orders not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting user orders" });
  }
};

const addFeedback = async (req, res) => {
  try {
    const newFeedbackAdded = await addNewFeedback(req.body);
    if (newFeedbackAdded) {
      res.status(201).json({ message: "New order added successfully" });
    } else {
      res.status(400).json({ message: "Check your request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding new order" });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const updateComplete = await modifyFeedbackById(req.body);
    if (updateComplete) {
      res.status(200).json({ message: "Update was successfull" });
    } else {
      res.status(400).json({ message: "Check your request" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating a order" });
  }
};

export {
  getAllFeedbacks,
  getFeedbackById,
  getAllUsersFeedbacks,
  addFeedback,
  updateFeedback,
};
