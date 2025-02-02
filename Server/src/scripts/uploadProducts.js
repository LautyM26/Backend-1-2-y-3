import mongoose from "mongoose"
import Product from "../models/products.js"
import fs from "fs"

const MONGO_URI = "mongodb+srv://LautiMejias:lauty26@cluster0.opy2t.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"

const uploadProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Conectado a MongoDB Atlas")

        // Leer productos desde el archivo JSON
        const filePath = "./src/data/products.json"
        const data = fs.readFileSync(filePath, "utf-8")
        const products = JSON.parse(data)

        // Insertar productos en la base de datos
        await Product.insertMany(products)
        console.log("Productos insertados correctamente")

        // Cerrar conexión
        mongoose.connection.close()
    } catch (error) {
        console.error("Error al subir productos:", error)
        mongoose.connection.close()
    }
}

uploadProducts()

// node --experimental-specifier-resolution=node src/scripts/uploadProducts.js