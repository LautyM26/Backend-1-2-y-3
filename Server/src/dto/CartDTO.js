export default class CartDTO {
    constructor({ _id, products }) {
      this.id       = _id
      this.items    = products.map(item => ({
        productId:  item.product._id ?? item.product,
        quantity:   item.quantity
      }))
    }
  }  