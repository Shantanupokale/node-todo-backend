import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);

app.get('/',(req,res) => {
    res.status(200).json({message: " backned is running "})
})

app.listen(PORT , () => {
    console.log(`server on port ${PORT}`
    )
})