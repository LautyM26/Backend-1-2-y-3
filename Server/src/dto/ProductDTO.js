export default class ProductDTO {
    constructor({ _id, title, description, price, code, stock, category, status }) {
      this.id          = _id
      this.title       = title
      this.description = description
      this.price       = price
      this.code        = code
      this.stock       = stock
      this.category    = category
      this.status      = status
    }
  }  