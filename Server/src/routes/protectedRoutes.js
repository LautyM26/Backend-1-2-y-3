import { Router } from "express"
import passport from "passport"

const router = Router()

router.get(
  "/perfil",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Accediste a una ruta protegida", user: req.user })
  }
)

export default router