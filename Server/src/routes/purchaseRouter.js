import express from 'express'
import passport from 'passport'
import { authorizeRoles } from '../middlewares/authorization.js'
import CartsRepository from '../repositories/CartsRepository.js'
import ProductModel from '../models/products.js'
import TicketModel from '../models/ticket.js'

const router    = express.Router()
const cartsRepo = new CartsRepository()

router.post(
  '/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),
  async (req, res) => {
    try {
      // 1) Cargo el carrito con productos poblados
      const cart = await cartsRepo.getByIdRaw(req.params.cid)
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' })

      const processed   = []  
      const notProcessed = [] 

      // 2) Recorro cada producto y compruebo stock
      for (const item of cart.products) {
        const prod = await ProductModel.findById(item.product._id)
        if (!prod) {
          notProcessed.push(item) 
          continue
        }
        if (prod.stock >= item.quantity) {
          prod.stock -= item.quantity
          await prod.save()
          processed.push({ product: prod, quantity: item.quantity })
        } else {
          notProcessed.push(item)
        }
      }

      // 3) Si no pudimos comprar nada, devolvemos sólo los no procesados
      if (processed.length === 0) {
        cart.products = notProcessed
        await cart.save()
        return res.status(400).json({
          message: 'No se pudo procesar ningún producto por falta de stock',
          notProcessed: notProcessed.map(i => i.product._id)
        })
      }

      // 4) Calculo el total sólo de los comprados
      const totalAmount = processed.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      )

      // 5) Genero el ticket con los datos de la compra
      const ticket = await TicketModel.create({
        amount: totalAmount,
        purchaser: req.user.email
      })

      // 6) Actualizo el carrito: dejo sólo los no procesados
      cart.products = notProcessed
      await cart.save()

      // 7) Devuelvo ticket y lista de IDs no procesados
      res.status(201).json({
        message: 'Compra finalizada',
        ticket,
        notProcessed: notProcessed.map(i => i.product._id)
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error al procesar la compra', error: error.message })
    }
  }
)

export default router