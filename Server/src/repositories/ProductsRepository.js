import MongooseDAO  from '../dao/MongooseDAO.js'
import ProductModel from '../models/products.js'
import ProductDTO   from '../dto/ProductDTO.js'

export default class ProductsRepository {
  constructor() {
    this.dao = new MongooseDAO(ProductModel)
  }

  async getAll(filter) {
    const prods = await this.dao.getAll(filter)
    return prods.map(p => new ProductDTO(p))
  }

  async getById(id) {
    const prod = await this.dao.getById(id)
    return new ProductDTO(prod)
  }

}