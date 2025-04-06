// src/routes/sessionsRouter.js
import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserRepository from '../repositories/UserRepository.js'

const router      = express.Router()
const SECRET_KEY  = 'claveSuperSecreta'
const userRepo    = new UserRepository()

// Middleware para parsear cookies
router.use(cookieParser())

// Registro de usuario
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body

  try {
    // Verificar si el usuario ya existe
    const existing = await userRepo.dao.model.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'El usuario ya está registrado' })
    }

    // Crear usuario (usamos directamente el DAO para no exponer DTO aquí)
    const newUser = await userRepo.dao.create({ first_name, last_name, email, age, password })
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: newUser._id, email: newUser.email } })
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message })
  }
})

// Login y generación de token
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Buscamos el usuario
    const user = await userRepo.dao.model.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    // Comparamos contraseña
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    // Generamos JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    )

    // Lo guardamos en cookie
    res.cookie('token', token, { httpOnly: true })
    res.json({ message: 'Inicio de sesión exitoso', user: { id: user._id, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message })
  }
})

// Ruta protegida: devuelve sólo el DTO del usuario
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Recargamos al usuario via repositorio para obtener el DTO
      const userDto = await userRepo.getById(req.user._id)
      res.json({ message: 'Usuario autenticado correctamente', user: userDto })
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message })
    }
  }
)

// Cerrar sesión (borrar cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Sesión cerrada correctamente' })
})

export default router