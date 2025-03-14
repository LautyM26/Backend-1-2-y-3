import express from 'express'
import passport from 'passport'

const router = express.Router()

// Ruta protegida que devolverá los datos del usuario logueado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' })
    }

    res.json({
        message: 'Usuario autenticado correctamente',
        user: req.user
    })
})

export default router