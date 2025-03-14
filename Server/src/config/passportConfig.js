const { Strategy, ExtractJwt } = require('passport-jwt')
const User = require('../models/user')

// Configurar la estrategia JWT
const JWTStrategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['token']]),
        secretOrKey: 'tu_clave_secreta', 
    },
    async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id)
            if (!user) {
                return done(null, false, { message: 'No se encontró el usuario' })
            }
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    }
)

module.exports = { JWTStrategy }