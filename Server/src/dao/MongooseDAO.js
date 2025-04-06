import GenericDAO from './GenericDAO.js'

export default class MongooseDAO extends GenericDAO {
  constructor(model) {
    super()
    this.model = model
  }

  async getById(id) {
    return this.model.findById(id)
  }

  async getAll(filter = {}) {
    return this.model.find(filter)
  }

  async create(data) {
    return this.model.create(data)
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id)
  }
}