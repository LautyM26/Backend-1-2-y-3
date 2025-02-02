import { Router } from "express"
import mongoose from "mongoose"
import Product from "../models/products.js"
import Cart from "../models/carts.js"

export const router = Router()

router.get("/", (req, res) => {
  res.render("menu")
})


router.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await Product.find({})
    res.render("realTimeProducts", { 
      products: products.map(product => ({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        id: product._id
      }) )});

  } catch (error) {
    console.error("Error al obtener los productos:", error)
    res.status(500).send("Error al cargar los productos")
  }
})


router.get("/products", async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query
  try {
    const searchFilter = query ? { title: { $regex: query, $options: "i" } } : {}
    const sortOrder = sort ? { price: sort === "asc" ? 1 : -1 } : {}

    const products = await Product.find(searchFilter)
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(limit)

    const totalProducts = await Product.countDocuments(searchFilter)
    const totalPages = Math.ceil(totalProducts / limit)

    res.render("index", {
      products: products.map(product => ({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        id: product._id
      })),
      totalPages,
      page: Number(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? Number(page) - 1 : null,
      nextPage: page < totalPages ? Number(page) + 1 : null,
      limit,
    })

  } catch (error) {
    console.error("Error al obtener los productos:", error)
    res.status(500).send("Error al cargar los productos")
  }
})


router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).send("ID de producto no válido")
  }

  try {
    const product = await Product.findById(pid)
    if (!product) {
      return res.status(404).send("Producto no encontrado")
    }

    res.render("productDetails", { product: product.toObject() })

  } catch (error) {
    console.error("Error al obtener el producto:", error)
    res.status(500).send("Error al cargar el producto")
  }
})


router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).send("ID de carrito no válido")
  }
  
  try {
    const cart = await Cart.findById(cid).populate("products.product")
    if (!cart) {
      return res.status(404).send("Carrito no encontrado")
    }

    res.render("cartDetails", { cart })

  } catch (error) {
    console.error("Error al obtener el carrito:", error)
    res.status(500).send("Error al cargar el carrito")
  }
})