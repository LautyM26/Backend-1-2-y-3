import express from "express"
import http from "http"
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import { engine } from "express-handlebars"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import passport from "passport"
import session from "express-session"
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import protectedRoutes from "./routes/protectedRoutes.js"
import sessionsRouter from './routes/sessionsRouter.js'
import UserModel from './models/user.js'
import cookieParser from 'cookie-parser'
import purchaseRouter from './routes/purchaseRouter.js'


// Conexión a MongoDB
const MONGO_URI = "mongodb+srv://LautiMejias:lauty26@cluster0.opy2t.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(MONGO_URI, {})
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((error) => console.error("Error al conectar a MongoDB Atlas:", error))

const PORT = 8080
const app = express()


// Configuración del middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use(express.static("./src/public"))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

app.use("/api/private", protectedRoutes)

app.use("/api/sessions", sessionsRouter)

app.use(cookieParser())

app.use('/api/purchase', purchaseRouter)


// Configuración de la sesión
app.use(
    session({
        secret: "miSecretoSuperSeguro",
        resave: false,
        saveUninitialized: false,
    })
)


// Passport JWT Strategy
const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'miSecretoSuperSeguro', 
}


// Configuramos Passport con la estrategia JWT
passport.use('jwt', new JWTStrategy(JWTOptions, (jwt_payload, done) => {
    UserModel.findById(jwt_payload.id, (err, user) => {
        if (err) return done(err, false)
        if (user) return done(null, user) 
        else return done(null, false) 
    })
}))


// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())


// Definir una ruta protegida
app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' })
    }
    res.json({ user: req.user })
})


// Configuración de WebSockets
const serverHTTP = http.createServer(app)
const serverSockets = new Server(serverHTTP)

serverSockets.on("connection", (socket) => {
    console.log(`Cliente conectado con id: ${socket.id}`)

    socket.on("newProduct", (product) => {
        console.log("Nuevo producto recibido:", product)
        serverSockets.emit("updateProducts", { action: "add", ...product })
    })

    socket.on("updateProduct", (product) => {
        console.log("Producto actualizado:", product)
        serverSockets.emit("updateProducts", { action: "update", ...product })
    })

    socket.on("deleteProduct", (productId) => {
        console.log("Producto eliminado:", productId)
        serverSockets.emit("updateProducts", { action: "delete", id: productId })
    })

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`)
    })
})


// Levantar el servidor HTTP
serverHTTP.listen(PORT, () => {
    console.log(`Servidor en línea en el puerto ${PORT}!!`)
})