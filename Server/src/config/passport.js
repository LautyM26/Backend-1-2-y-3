import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import UserModel from "../models/user.js"

const SECRET_KEY = "claveSuperSecreta"

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
}

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserModel.findById(jwt_payload.id)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (error) {
      return done(error, false)
    }
  })
)