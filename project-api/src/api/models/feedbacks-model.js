import promisePool from "../../utils/database.js";
/**
 * Query for all feedbacks
 * @returns all feedbacks as a list
 */
const getAllFeedbacks = async () => {
  return await promisePool.query("SELECT * FROM feedbacks");
};

/**
 * Query for feedback by id
 * @param {*} id feedback unique id
 * @returns false if no feedback found, feedback if found
 */
const getOneFeedbackById = async (id) => {
  const [feedback] = await promisePool.query(`SELECT * FROM feedbacks WHERE ID = ?)`, [
    id,
  ]);
  if (feedback.length === 0) {
    return false;
  }
  return feedback;
};
