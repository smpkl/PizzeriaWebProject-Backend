import {
  findAllAnnouncements,
  findAnnouncementById,
  addNewAnnouncement,
  modifyAnnouncementById,
  removeAnnouncement,
} from "./announcements-model.js";

const getAllAnnouncements = async (req, res, next) => {
  try {
    console.log("here")
    const results = await findAllAnnouncements();
    res.status(200).json({ message: "Announcements found", results });
  } catch (error) {
    console.log(error)
    next({ status: 500, message: "Error getting meals" });
  }
};

const getAnnouncementById = async (req, res, next) => {
  try {
    const results = await findAnnouncementById(req.params.id);
    console.log(results);
    if (results) {
      res.status(200).json({ message: "Announcement found", results });
    } else {
      next({ status: 404, message: "Announcement not found" });
    }
  } catch (error) {
    next({ status: 500, message: "Error getting announcements" });
  }
};

const postAnnouncement = async (req, res, next) => {
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

    const newAnnouncement = req.body;
    const result = await addNewAnnouncement(newAnnouncement);
    if (result.announcementId) {
      res.status(200).json({ message: "New announcement added", result });
    } else {
      next({ status: 400, message: "Could not add announcement" });
    }
  } catch (error) {
    console.log(error);
    next({ status: 500, message: "Error adding announcement" });
  }
};

const putAnnouncement = async (req, res, next) => {
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

    const announcementId = req.params.id;
    const newAnnouncementInfo = req.body;
    const result = await modifyAnnouncementById(
      announcementId,
      newAnnouncementInfo
    );
    if (result.announcementId) {
      res.status(200).json({ message: "Announcement info updated", result });
    } else {
      next({ status: 400, message: "Could not update announcement" });
    }
  } catch (error) {
    next({ status: 500, message: "Error updating announcement" });
  }
};

const deleteAnnouncement = async (req, res, next) => {
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
    const announcementId = req.params.id;
    const result = await removeAnnouncement(announcementId);
    console.log(result);
    if (result.announcementId) {
      res.status(200).json({
        message: "Announcement deleted",
        result,
      });
    } else {
      next({ status: 400, message: "Could not delete announcement" });
    }
  } catch (error) {
    next({ status: 500, message: "Error deleting announcement" });
  }
};

export {
  getAllAnnouncements,
  getAnnouncementById,
  postAnnouncement,
  putAnnouncement,
  deleteAnnouncement,
};
