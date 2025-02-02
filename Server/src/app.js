import express from "express"
import http from "http"
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import { engine } from "express-handlebars"
import { router as viewsRouter } from "./routes/viewsRouter.js"
import { Server } from "socket.io"
import mongoose from "mongoose"

const PORT = 8080;
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use(express.static("./src/public"))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" })
});

const serverHTTP = http.createServer(app)
const serverSockets = new Server(serverHTTP)

serverSockets.on("connection", (socket) => {
    console.log(`Cliente conectado con id: ${socket.id}`)

    socket.on("newProduct", (product) => {
        console.log("Nuevo producto recibido:", product)
        serverSockets.emit("updateProducts", { action: "add", ...product })
    });

    socket.on("updateProduct", (product) => {
        console.log("Producto actualizado:", product)
        serverSockets.emit("updateProducts", { action: "update", ...product })
    });

    socket.on("deleteProduct", (productId) => {
        console.log("Producto eliminado:", productId)
        serverSockets.emit("updateProducts", { action: "delete", id: productId })
    });

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`)
    });
});

serverHTTP.listen(PORT, () => {
    console.log(`Servidor en línea en el puerto ${PORT}!!`)
});


// Conectar a MongoDB
const MONGO_URI = "mongodb+srv://LautiMejias:lauty26@cluster0.opy2t.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGO_URI, {})
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((error) => console.error("Error al conectar a MongoDB Atlas:", error)
)