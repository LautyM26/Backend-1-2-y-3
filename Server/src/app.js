import express from "express"
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import {engine} from "express-handlebars"
import {router as viewsRouter} from "./routes/viewsRouter.js"
import {Server} from "socket.io"
import http from "http" 

const PORT=8080
const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine ("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)



app.get("/", (req, res) => {

    res.render("/")
})


app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" })
});



app.use(express.static("./src/public"))


const serverHTTP = http.createServer(app)

const serverSockets = new Server(serverHTTP)


serverSockets.on("connection", socket => {
    console.log(`Se conecto un cliente con id ${socket.id}`)

    socket.on("addProduct", (newProduct) => {
        const products = productsManager.getProducts()
        products.push({ id: products.length + 1, ...newProduct })
        saveProducts(products)

        io.emit("updateProducts", products)
    });

    socket.on("deleteProduct", (productId) => {
        let products = productsManager.getProducts()
        products = products.filter((product) => product.id !== productId)
        saveProducts(products)

        io.emit("updateProducts", products)
    });
})


serverHTTP.listen(PORT, () => {
    console.log(`Server en linea en puerto ${PORT}!!`)
})