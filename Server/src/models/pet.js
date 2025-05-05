import mongoose from 'mongoose'

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  age: Number,
});

export default mongoose.model('Pet', petSchema)