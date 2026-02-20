import pool from "../config/db.js";

const allowedStatus = ["in-progress", "on-hold", "complete"];

export const createSubtask = async (req, res, next) => {
  try {
    const { title, description, todo_id } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    if (!todo_id) {
      return res.status(400).json({
        success: false,
        message: "Todo ID is required",
      });
    }

    const { rows } = await pool.query(
      "INSERT INTO subtasks (title, description, todo_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title.trim(), description, todo_id, req.user.userId],
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

export const getSubtasksByTodo = async (req, res, next) => {
  try {
    const { todo_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM subtasks WHERE todo_id = $1 AND user_id = $2 ORDER BY created_at ASC`,
      [todo_id, req.user.userId],
    );
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubtask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await pool.query(
      `UPDATE subtasks SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5 RETURNING *`,
      [title.trim(), description, status, id, req.user.userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    const updatedSubtask = result.rows[0];

    // Bonus: check if all subtasks are completed
    if (status === "complete") {
      const todo_id = updatedSubtask.todo_id;
      const subtasksResult = await pool.query(
        `SELECT status FROM subtasks WHERE todo_id = $1`,
        [todo_id],
      );

      const allComplete = subtasksResult.rows.every(
        (st) => st.status === "complete",
      );

      if (allComplete) {
        await pool.query(
          `UPDATE todos SET status = 'complete', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [todo_id],
        );
      }
    }

    res.status(200).json({
      success: true,
      data: updatedSubtask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubtask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM subtasks WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Subtask deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
