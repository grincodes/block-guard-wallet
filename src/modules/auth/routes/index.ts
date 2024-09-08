import express from "express"
import { authController } from "../../../useCases"
import "reflect-metadata"
import passport from "passport"
import { middleware } from "../../../../../lib/infra/http"
import { LoginRequestDto } from "../../../dto/LoginRequestDto"
import { TokenPayload } from "../../../interfaces/token-payload.interface"
import { Config } from "../../../../../config"
import jwt from "jsonwebtoken"

const authRouter = express.Router()

authRouter.post("/login", middleware.validateDto(LoginRequestDto), (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      // Authentication failed, send a custom error message
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
    }

    const expires = new Date()
    expires.setSeconds(expires.getSeconds() + Config.JWT_EXPIRATION)

    const token = jwt.sign(tokenPayload, Config.JWT_SECRET, { expiresIn: Config.JWT_EXPIRATION })

    res.cookie("Authentication", token, {
      httpOnly: true,
      expires,
    })

    res.status(200).json({ token })
  })(req, res, next)
})

//logout
authRouter.post("/logout", (req: any, res) => {
  req.logout()
})

//profile
authRouter.get("/profile", [middleware.checkAuthToken,passport.authenticate("jwt", { session: false })], (req: any, res) => {
  authController.execute(req, res, () => authController.profile())
})

export { authRouter }
