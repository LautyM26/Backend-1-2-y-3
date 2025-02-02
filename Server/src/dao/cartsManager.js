import Cart from "../models/carts.js"

class CartsManager {
    async getCarts() {
        try {
            return await Cart.find().populate("products.product")
        } catch (error) {
            console.error("❌ Error al obtener los carritos:", error)
            throw new Error("Error al obtener los carritos")
        }
    }

    async createCart() {
        try {
            const newCart = new Cart({ products: [] })
            await newCart.save()
            return newCart
        } catch (error) {
            console.error("❌ Error al crear el carrito:", error)
            return null
        }
    }

    async getCartById(cid) {
        try {
            return await Cart.findById(cid).populate("products.product")
        } catch (error) {
            console.error("❌ Error al obtener el carrito:", error)
            return null
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid)
            if (!cart) return null;

            const existingProduct = cart.products.find((item) => item.product.toString() === pid)

            if (existingProduct) {
                existingProduct.quantity += 1
            } else {
                cart.products.push({ product: pid, quantity: 1 })
            }

            await cart.save()
            return cart
        } catch (error) {
            console.error("❌ Error al agregar el producto al carrito:", error)
            return null
        }
    }
}


export default CartsManager;