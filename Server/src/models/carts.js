import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, {
  versionKey: false,
  timestamps: false
})

export default mongoose.model('Cart', cartSchema)