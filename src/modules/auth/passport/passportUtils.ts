import { userService } from "../../../users/useCases"

export const authUser = async (email, password, done) => {
  try {
    const user = await userService.verifyUser(email, password)

    if (!user) {
      return done(null, false, { message: "invalid credentials" })
    }

    return done(null, user)
  } catch (error) {
    return done(error)
  }
}

export const jwtAuth = async (jwtPayload, done) => {
  try {
    const user = await userService.validateUser(jwtPayload.id)
    delete user.password

    if (user) {
      return done(null, user)
    } else {
      return done(null, false, { message: "User not found" })
    }
  } catch (error) {
    return done(null, false, { message: "User not found" })
  }
}
