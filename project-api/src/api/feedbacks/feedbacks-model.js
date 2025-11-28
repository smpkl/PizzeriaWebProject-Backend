import promisePool from "../../utils/database.js";

/**
 * Query for all feedbacks
 * @returns all feedbacks as a list
 */
const findAllFeedbacks = async () => {
  const [feedbacks] = await promisePool.query(`SELECT * FROM feedbacks`);
  return feedbacks;
};

/**
 * Query for feedback by id
 * @param {*} id feedback unique id
 * @returns false if no feedback found, feedback if found
 */
const findFeedbackById = async (id) => {
  const [feedback] = await promisePool.query(
    `SELECT * FROM feedbacks WHERE id = ?`,
    [id]
  );
  if (feedback.length === 0) {
    return false;
  }
  return feedback;
};

/**
 * Query for all orders per user
 * @param {*} userId users id
 * @returns false if no orders found, list of orders if found
 */
const findFeedbacksByUserId = async (userId) => {
  const [feedbacks] = await promisePool.query(
    `SELECT * FROM feedbacks WHERE user_id = ?`,
    [userId]
  );
  if (feedbacks.length === 0) {
    return false;
  }
  return feedbacks;
};

/**
 * Query for adding new feedback to the database
 * @param {*} feedbackData is JSON with all necessary information
 * @returns false if it was faile to add, JSON { feedbackId: result[0].insertId }
 * if added to the database
 */
const addNewFeedback = async (feedbackData) => {
  const { user_id, email, feedback, status, received, handled } = feedbackData;
  const sql = `INSERT INTO feedbacks (user_id, email, feedback, status, received, handled) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, email, feedback, status, received, handled];
  const result = await promisePool.execute(sql, params);
  if (result[0].affectedRows === 0) {
    return false;
  }
  return { feedbackId: result[0].insertId };
};

/**
 * Updates new information of feedback to the database
 * @param {*} id id of feedback wanted to update
 * @param {*} newInfo JSON with all columns info sql of information that is wanted to upgrade.
 * Can include null values of fields that are not wanted to update.
 * @returns false if feedback is not found by its id or update fails,
 * if update goes through it returns JSON {feedbackId: id}
 */
const modifyFeedbackById = async (id, newInfo) => {
  const feedbackRow = await findFeedbackById(id);
  if (feedbackRow) {
    const { user_id, email, feedback, status, received, handled } =
      feedbackRow[0];

    const updateJSON = {
      user_id: newInfo.user_id ?? user_id,
      email: newInfo.email ?? email,
      feedback: newInfo.feedback ?? feedback,
      status: newInfo.status ?? status,
      received: newInfo.received ?? received,
      handled: newInfo.handled ?? handled,
    };

    const sql = `
    UPDATE feedbacks
    SET user_id = ?, email = ?, feedback = ?, status = ?, received = ?, handled = ?
    WHERE id = ?`;
    const result = await promisePool.execute(sql, [
      updateJSON.user_id,
      updateJSON.email,
      updateJSON.feedback,
      updateJSON.status,
      updateJSON.received,
      updateJSON.handled,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { feedbackId: id };
  } else {
    return false;
  }
};

/**
 * Query for removing a feedback
 * @param {*} id feedback unique id
 * @returns false if feedback could not be deleted, feedback_Id if feedback was deleted
 */
const removeFeedback = async (id) => {
  try {
    const result = await promisePool.execute(
      `DELETE FROM feedbacks WHERE id = ?`,
      [id]
    );
    if (result[0].affectedRows === 0) {
      return false;
    }
    return { feedback_Id: id };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  findAllFeedbacks,
  findFeedbackById,
  findFeedbacksByUserId,
  addNewFeedback,
  modifyFeedbackById,
  removeFeedback,
};
