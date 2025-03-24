import express from 'express'
import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'

const router = express.Router()
const SECRET_KEY = "claveSuperSecreta"

// Ruta para iniciar sesión y guardar en sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' })
        }

        const isMatch = bcrypt.compareSync(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' })
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        res.json({ message: 'Inicio de sesión exitoso', user: req.session.user })
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error })
    }
})

router.get('/current', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado' })
    }

    res.json({
        message: 'Usuario autenticado correctamente',
        user: req.session.user
    })
})

// Cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' })
        }
        res.json({ message: 'Sesión cerrada correctamente' })
    })
})

export default router