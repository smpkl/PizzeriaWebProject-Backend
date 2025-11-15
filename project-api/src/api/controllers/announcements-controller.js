import bcrypt from "bcrypt";
import {
  findAllAnnouncements,
  findAnnouncementById,
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

export { getAllAnnouncements, getAnnouncementById };
