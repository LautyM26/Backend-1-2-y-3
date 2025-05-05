import { faker } from '@faker-js/faker'

export function getMockingPets(count = 10) {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.animal.cat(),        
      type: faker.animal.type(),       
      age: faker.datatype.number({ min: 0, max: 15 }),
    })
  }
  return pets
}