import express from 'express';
import path from "path";;
import mongoose from 'mongoose'
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js';
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";

const app = express()
const PORT = 4000

mongoose.connect('mongodb+srv://lucasbenielli:785JahPnIQZk8SOs@clusterlb.d50iram.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter);
// app.use('/api/messages', messageRouter);

app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})