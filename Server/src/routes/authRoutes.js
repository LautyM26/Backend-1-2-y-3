import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import UserModel from "../models/user.js"

const router = Router()
const SECRET_KEY = "claveSuperSecreta"

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" })
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    )

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error })
  }
})

export default router