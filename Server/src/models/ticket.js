import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4().replace(/-/g, '').slice(0, 10)  // ejemplo: 10 caracteres únicos
  },
  purchase_datetime: {
    type: Date,
    default: () => Date.now()
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }
}, {
  versionKey: false,
  timestamps: false
})

export default mongoose.model('Ticket', ticketSchema)