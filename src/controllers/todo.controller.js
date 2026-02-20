import pool from "../config/db.js"

const allowedStatus = ["in-progress", "on-hold", "complete"];

export const createTodo = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const result = await pool.query(
            `INSERT INTO todos (title, description , user_id) VALUES ($1, $2, $3) RETURNING *`,
            [title, description, req.user.userId]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};


export const updateTodo = async (req,res,next)=> {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
            if (
                title === undefined ||
                description === undefined ||
                status === undefined
            ) {
              return res.status(400).json({
              success: false,
               message: "All fields are required"
              });
            }

            if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const result = await pool.query(
            `UPDATE todos SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5 RETURNING *`,
            [title.trim(), description, status, id , req.user.userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM todos
            WHERE id = $1 AND user_id = $2`,
            [id, req.user.userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getTodos = async (req, res, next) => {
 try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const bookmarked = req.query.bookmarked;

    const offset = (page - 1) * limit;
    let conditions = [];
    let values = [];
    let index = 1;
    
    conditions.push(`user_id = $${index}`);
    values.push(req.user.userId);
    index++;

    // search query
    if (search) {
      conditions.push(`(title ILIKE $${index} OR description ILIKE $${index})`);
      values.push(`%${search}%`);
      index++;
    }

    if (bookmarked === "true") {
      conditions.push(`bookmarked = true`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const todosQuery = `
      SELECT * FROM todos
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${index} OFFSET $${index + 1}
    `;
    values.push(limit, offset);

    const todosResult = await pool.query(todosQuery, values);

    const countQuery = `SELECT COUNT(*) FROM todos ${whereClause} `;

    const countResult = await pool.query(
      countQuery,
      values.slice(0, index - 1)
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: todosResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  
  } catch (error) {
    next(error);
  }
};


export const getTodoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Todo ID is required'
            });
        }
        const result = await pool.query(
            `SELECT * FROM todos WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }
        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE todos SET bookmarked = NOT bookmarked,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING * `, [id , req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};