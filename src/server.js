import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js'

import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use("/api/categories", categoryRoutes);

app.get('/',(req,res) => {
    res.status(200).json({message: " backned is running "})
})

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`server on port ${PORT}`);
    });
};

startServer();