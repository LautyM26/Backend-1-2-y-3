import express from "express"
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js"; 

const PORT=8080
const app=express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.get("/", (req, res) => {

    res.send("Bienvenido al Server")
})

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log(`Server en linea en puerto ${PORT}!!`)
})