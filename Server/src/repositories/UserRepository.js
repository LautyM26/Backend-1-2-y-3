import MongooseDAO from '../dao/MongooseDAO.js'
import UserModel    from '../models/user.js'
import UserDTO      from '../dto/UserDTO.js'

export default class UserRepository {
  constructor() {
    this.dao = new MongooseDAO(UserModel)
  }

  async getById(id) {
    const user = await this.dao.getById(id)
    if (!user) throw new Error('Usuario no encontrado')
    return new UserDTO(user)
  }

  async create(userData) {
    const user = await this.dao.create(userData)
    return new UserDTO(user)
  }

  async update(id, data) {
    const user = await this.dao.update(id, data)
    return new UserDTO(user)
  }
}