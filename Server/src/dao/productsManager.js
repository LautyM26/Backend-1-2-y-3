import Product from "../models/products.js"

class ProductsManager {
    async getProducts() {
        try {
            return await Product.find()
        } catch (error) {
            console.error("❌ Error al obtener los productos:", error)
            throw new Error("Error al obtener los productos")
        }
    }

    async addProduct(product) {
        const { title, description, code, price, status, stock, category } = product

        if (!title || !description || !code || price == null || stock == null || !category) {
            throw new Error("⚠️ Todos los campos son obligatorios")
        }

        try {
            const newProduct = new Product({ title, description, code, price, status, stock, category })
            await newProduct.save()
            return newProduct
        } catch (error) {
            console.error("❌ Error al agregar el producto:", error)
            throw new Error("Error al agregar el producto")
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id)
        } catch (error) {
            console.error("❌ Error al obtener el producto:", error)
            return null
        }
    }

    async updateProductById(id, updatedFields) {
        try {
            return await Product.findByIdAndUpdate(id, updatedFields, { new: true })
        } catch (error) {
            console.error("❌ Error al actualizar el producto:", error)
            return null
        }
    }

    async deleteProductById(id) {
        try {
            return await Product.findByIdAndDelete(id)
        } catch (error) {
            console.error("❌ Error al eliminar el producto:", error)
            return null
        }
    }
}

export default new ProductsManager()