import pool from "../config/db"

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
            `INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *`,
            [title, description]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};


// export const updateTodo = async (req,res,next)=> {
//     try {
//         const { id } = req.params;
//         const { title, description, status } = req.body;
//             if (!title || !description || !status) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'All fields are required'
//                 });
//             }
//         const result = await pool.query(
//             `UPDATE todos SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP
//              WHERE id = $4 RETURNING *`,
//             [title, description, status, id]
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Todo not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: result.rows[0]
//         });
//     } catch (error) {
//         next(error);
//     }
// };

export const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM todos
             WHERE id = $1`,
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
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getTodos = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT * FROM todos
             ORDER BY created_at DESC`
        );
        res.status(200).json({
            success: true,
            data: result.rows
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