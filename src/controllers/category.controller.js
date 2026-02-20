import pool from "../config/db.js";

export const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, display_name FROM categories
       ORDER BY display_name ASC`
    );
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, display_name } = req.body;
    if (!name || !display_name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existing = await pool.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );
    if (existing.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, display_name)
       VALUES ($1, $2)
       RETURNING *`,
      [name, display_name]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};