import MongooseDAO from '../dao/MongooseDAO.js'
import CartModel   from '../models/carts.js'
import CartDTO     from '../dto/CartDTO.js'

export default class CartsRepository {
  constructor() {
    this.dao = new MongooseDAO(CartModel)
  }

  async getById(id) {
    const cart = await CartModel.findById(id).populate('products.product')
    return new CartDTO(cart)
  }

}
