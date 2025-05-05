import { Router } from 'express'
import { generateMockUsers } from '../utils/mocking.js'
import UserModel from '../models/user.js'
import PetModel from '../models/pet.js'
import { getMockingPets } from '../controllers/mockingPets.js';

const router = Router()

router.get('/mockingpets', (req, res, next) => getMockingPets(req, res, next))

router.get('/mockingusers', (req, res) => {
  const mocks = generateMockUsers(50)
  res.json({ status: 'success', payload: mocks })
});

router.post('/generateData', async (req, res) => {
  const { users: numUsers = 0, pets: numPets = 0 } = req.body
  try {
    const mockUsers = generateMockUsers(Number(numUsers))
    await UserModel.insertMany(mockUsers)

    const mockPets = getMockingPets(Number(numPets))
    await PetModel.insertMany(mockPets)

    res.json({
      status: 'success',
      inserted: { users: mockUsers.length, pets: mockPets.length }
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router