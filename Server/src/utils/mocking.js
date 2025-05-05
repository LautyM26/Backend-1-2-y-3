import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

export function generateMockUsers(count) {
  const users = []
  for (let i = 0; i < count; i++) {
    const role = Math.random() < 0.5 ? 'user' : 'admin'
    const user = {
      _id: faker.database.mongodbObjectId(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('coder123', 10),
      role,
      pets: [],
    }
    users.push(user)
  }
  return users
}