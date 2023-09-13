import express from 'express';
import path from "path";
import mongoose from 'mongoose'
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js';
import messageRouter from './routes/messages.routes.js';
import { cartModel } from './models/carts.models.js';
import { messageModel } from './models/message.models.js';
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";

const app = express()
const PORT = 4000

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

mongoose.connect('mongodb+srv://lucasbenielli:785JahPnIQZk8SOs@clusterlb.d50iram.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
        console.log('BDD conectada')
        const resultados = await cartModel.findOne({ _id: '6501ec319476763e35c7a8e0' });
        console.log(JSON.stringify(resultados))
    })
    .catch(() => console.log('Error en conexion a BDD'))

app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use("/chat", express.static(path.join(__dirname, "/public")));

const io = new Server(serverExpress);

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter);
app.use('/api/messages', messageRouter);

io.on('connection', (socket)=> {
    console.log('Socket io conectado')

    socket.on('add-message', async ({email, mensaje}) => {
        await messageModel.create({email: email, message: mensaje})
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('messages-list', async() =>{
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })
});

app.get('/chat', (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "index.css",
        title: "Chat",
    });
})

// app.get("/", async (req,res) => {
//     const productList = await productsManager.getProducts();
//     res.render("index", {
//             css: "index.css",
//             title: "Index",
//             products: productList
//     });
// });

// app.get("/static", (req, res) => {
//     res.render("realTimeProducts", {
//         css: "static.css",
//         title: "Products",
//         js: "realTimeProducts.js"
//     }) 
// })