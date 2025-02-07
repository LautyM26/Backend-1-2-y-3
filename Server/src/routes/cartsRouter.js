import express from "express"
import CartsManager from "../dao/cartsManager.js"
import { getDB } from "../dataBase/db.js"

const cartsManager = new CartsManager("./src/data/carts.json")

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const carts = await cartsManager.getCarts()
        return res.status(200).json({ payload: carts })
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los carritos" })
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


router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartsManager.addProductToCart(cid, pid)
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }
        return res.status(200).json({
            message: `Producto con ID ${pid} agregado al carrito con ID ${cid}`,
            cart,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al agregar el producto al carrito" })
    }
})


router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartsManager.removeProductFromCart(cid, pid)
        if (!cart) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado en el carrito` })
        }
        return res.status(200).json({
            message: "Producto eliminado del carrito",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar el producto del carrito" })
    }
})


router.delete("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartsManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }

        cart.products = []
        await cartsManager.saveCarts(cart)
        return res.status(200).json({
            message: "Carrito vaciado",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al vaciar el carrito" })
    }
})



router.put("/:cid", async (req, res) => {
    const { cid } = req.params
    const { products } = req.body
    try {
        const cart = await cartsManager.updateCart(cid, products)
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }
        return res.status(200).json({
            message: "Carrito actualizado",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el carrito" })
    }
})


router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartsManager.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ error: `No se encontró el carrito con ID ${cid}` })
        }

        const productIndex = cart.products.findIndex(item => item.product === Number(pid))
        if (productIndex === -1) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado en el carrito` })
        }

        cart.products[productIndex].quantity = quantity
        await cartsManager.saveCarts(cart);
        return res.status(200).json({
            message: "Cantidad actualizada",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar la cantidad del producto" })
    }
})


router.get("/", async (req, res) => {
    try {
        const db = getDB()
        const products = await db.collection("products").find().toArray()
        return res.status(200).json({ payload: products })

    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los productos" })
    }
})


router.post("/", async (req, res) => {
    const newProductData = req.body
    try {
        const db = getDB()
        const result = await db.collection("products").insertOne(newProductData)
        return res.status(201).json({
            message: "Producto agregado exitosamente",
            product: result.ops[0],
        })

    } catch (error) {
        return res.status(500).json({ error: "Error al agregar el producto" })
    }
})

export default router
