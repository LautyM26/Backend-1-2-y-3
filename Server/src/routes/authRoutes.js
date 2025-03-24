import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import UserModel from "../models/user.js"

const router = Router()
const SECRET_KEY = "claveSuperSecreta"

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body

  try {
    // Verificar si el usuario ya existe
    const userExists = await UserModel.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya está registrado" })
    }

    // Crear nuevo usuario
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password, 
    })

    await newUser.save()

    res.status(201).json({ message: "Usuario registrado exitosamente" })
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error })
  }
})


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