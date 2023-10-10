import "dotenv/config"
import express from 'express';
import path from "path";
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./routes/index.routes.js";
import { productModel } from "./models/products.models.js";
import { messageModel } from './models/message.models.js';
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";

const app = express()
const PORT = 4000

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//BDD
mongoose.connect(process.env.MONGO_URL)
    .then( async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))

//Router
app.use("/", router);

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        },
        ttl: 60 

    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Middleware autorización
const auth = (req, res, next) => {
    if (req.session.login === true) {
      next();
    } else {
      res.redirect("/login");
    }
  };

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use("/chat", express.static(path.join(__dirname, "/public")));
app.use("/products", express.static(path.join(__dirname, "/public")));
app.use("/login", express.static(path.join(__dirname, "/public")));

//Server Socket
const io = new Server(serverExpress);

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


//Vistas HBS
app.get("/products", auth, async (req, res) => {
    try {
      const products = await productModel.find();
     
      res.render("products", {
        css: "products.css",
        title: "Listado de productos",
        js: "products.js",
        products: products.map((product) => ({
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          code: product.code,
        })),
        sessionActive: req.session.login,
        username: req.session.first_name, 
              });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  });

app.get("/login", (req, res) => {
    res.render("login", {
      css: "static.css",
      js: "login.js",
      title: "Login",
    });
  });

app.get('/chat', (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "index.css",
        title: "Chat",
    });
  })
