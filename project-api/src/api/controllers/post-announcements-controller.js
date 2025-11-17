import {
  findAllAnnouncements,
  findAnnouncementById,
  getAnnouncementsByCategory,
  getAnnouncementsByTag,
  addNewAnnouncement,
  addAnnouncementTag,
  removeAnnouncementTag,
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

const getAnnouncementsByTagId = async (req, res) => {
  try {
    const [announcements] = await getAnnouncementsByTag(req.params.tagId);
    if (announcements) {
      res.status(200).json({ message: "Announcements found", products });
    } else {
      res.status(404).json({ message: "Announcements not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting announcements" });
  }
};

const postAnnouncements = async (req, res) => {
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

const postAnnouncementTag = async (req, res) => {
  try {
    const announcementId = req.params.announcementId;
    const tagId = req.body.tag_id;

    const result = await addAnnouncementTag(announcementId, tagId);
    if (result) {
      res
        .status(200)
        .json({ message: "New tag added for announcement", result });
    } else {
      res.status(400).json({ message: "Could not add tag for announcement" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding tag for announcement" });
  }
};

const deleteAnnouncementTag = async (req, res) => {
  try {
    const announcementId = req.params.announcementId;
    const tagId = req.params.tagId;
    const result = await removeAnnouncementTag(announcementId, tagId);
    if (result) {
      res
        .status(200)
        .json({ message: "Tag removed from an announcement", result });
    } else {
      res
        .status(400)
        .json({ message: "Could not remove a tag from announcement" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing tag from an announcement" });
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
      res.status(200).json({ message: "announcement info updated", result });
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
        message: "announcement deleted",
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
  getAnnouncementsByTagId,
  postAnnouncements,
  postAnnouncementTag,
  deleteAnnouncementTag,
  putAnnouncement,
  deleteAnnouncement,
};
