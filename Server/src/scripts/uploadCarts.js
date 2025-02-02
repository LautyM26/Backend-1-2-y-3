import mongoose from "mongoose"
import Cart from "../models/carts.js"
import fs from "fs"

const MONGO_URI = "mongodb+srv://LautiMejias:lauty26@cluster0.opy2t.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"

const uploadCarts = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Conectado a MongoDB Atlas")

        // Lee carritos desde el archivo JSON
        const filePath = "./src/data/carts.json"
        const data = fs.readFileSync(filePath, "utf-8")
        const carts = JSON.parse(data);

        // Inserta carritos en la base de datos
        await Cart.insertMany(carts);
        console.log("Carritos insertados correctamente")

        // Cierra conexión
        mongoose.connection.close()
    } catch (error) {
        console.error("Error al subir carritos:", error)
        mongoose.connection.close()
    }
}

uploadCarts()

// node --experimental-specifier-resolution=node src/scripts/uploadCarts.js