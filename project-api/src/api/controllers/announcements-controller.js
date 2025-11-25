import bcrypt from "bcrypt";
import {
  findAllAnnouncements,
  findAnnouncementById,
  addNewAnnouncement,
  modifyAnnouncementById,
  removeAnnouncement,
} from "../models/announcements-model.js";

const getAllAnnouncements = async (req, res) => {
  try {
    const results = await findAllAnnouncements();
    res.status(200).json({ message: "Announcements found", results });
  } catch (error) {
    res.status(500).json({ message: "Error getting meals" });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const results = await findAnnouncementById(req.params.id);
    console.log(results);
    if (results) {
      res.status(200).json({ message: "Announcement found", results });
    } else {
      res.status(404).json({ message: "Announcement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting announcements" });
  }
};

const postAnnouncement = async (req, res) => {
  try {
    const newAnnouncement = req.body;
    const result = await addNewAnnouncement(newAnnouncement);
    if (result.announcementId) {
      res.status(200).json({ message: "New announcement added", result });
    } else {
      res.status(400).json({ message: "Could not add announcement" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding announcement" });
  }
};

const putAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const newAnnouncementInfo = req.body;
    const result = await modifyAnnouncementById(
      announcementId,
      newAnnouncementInfo
    );
    if (result.announcementId) {
      res.status(200).json({ message: "Announcement info updated", result });
    } else {
      res.status(400).json({ message: "Could not update announcement" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating announcement" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const result = await removeAnnouncement(announcementId);
    console.log(result);
    if (result.announcementId) {
      res.status(200).json({
        message: "Announcement deleted",
        result,
      });
    } else {
      res.status(400).json({
        message: "Could not delete announcement",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting announcement" });
  }
};

export {
  getAllAnnouncements,
  getAnnouncementById,
  postAnnouncement,
  putAnnouncement,
  deleteAnnouncement,
};
