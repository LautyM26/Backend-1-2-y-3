import express from "express"
import CartsManager from "../dao/cartsManager.js"

const router = express.Router()

const cartsManager = new CartsManager("./src/data/carts.json")


router.post("/", async (req, res) => {
    try {
        const newCart = await cartsManager.createCart()
        return res.status(201).json({
            message: "Carrito creado exitosamente",
            cart: newCart,
        })

    } catch (error) {
        return res.status(500).json({ error: "Error al crear el carrito" })
    }
})


router.get("/:cid", async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await cartsManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }
        return res.status(200).json(cart)

    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el carrito" })
    }
})


router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params

    try {
        const cart = await cartsManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }

        const updatedCart = await cartsManager.addProductToCart(cid, pid)
        return res.status(200).json({
            message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
            cart: updatedCart,
        })

    } catch (error) {
        return res.status(500).json({ error: "Error al agregar el producto al carrito" })
    }
});


router.delete("api/carts/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const updatedCart = await cartsManager.removeProductFromCart(cid, pid);
        return res.status(200).json({ message: "Producto eliminado del carrito", cart: updatedCart })

    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar el producto del carrito" })
    }
})


router.put("api/carts/:cid", async (req, res) => {
    const { cid } = req.params
    const { products } = req.body
    try {
        const updatedCart = await cartsManager.updateCart(cid, products)
        return res.status(200).json({ message: "Carrito actualizado", cart: updatedCart })

    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el carrito" })
    }
})


router.put("api/carts/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const updatedCart = await cartsManager.updateProductQuantity(cid, pid, quantity)
        return res.status(200).json({ message: "Cantidad actualizada", cart: updatedCart })

    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar la cantidad del producto" })
    }
})


router.delete("api/carts/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const updatedCart = await cartsManager.clearCart(cid)
        return res.status(200).json({ message: "Carrito vaciado", cart: updatedCart })

    } catch (error) {
        return res.status(500).json({ error: "Error al vaciar el carrito" })
    }
})

export default router