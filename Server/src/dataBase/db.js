import { MongoClient } from "mongodb"

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

let database

export const connectToDB = async () => {
    try {
        await client.connect()
        console.log("Conectado a MongoDB Atlas")
        database = client.db("Cluster0")
    } catch (error) {
        console.error("Error al conectar a MongoDB Atlas:", error)
        throw error
    }
};

export const getDB = () => {
    if (!database) {
        throw new Error("La base de datos no está inicializada")
    }
    return database
}