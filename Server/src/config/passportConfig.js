import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.js'

const JWTStrategy = new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['token']]),
        secretOrKey: 'claveSuperSecreta',
    },
    async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id)
            if (!user) {
                return done(null, false)
            }
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    }
)

export { JWTStrategy }