// import rateLimit from "express-rate-limit"
import { plainToInstance } from "class-transformer"
import { RequestHandler } from "express"
import { Guard } from "../../../core/logic/Guard"

export class Middleware {
  public validateDto(dtoClass: any): RequestHandler {
    return async (req, res, next) => {
      const dtoInstance = plainToInstance(dtoClass, req.body)

      const error = Guard.validateAndError(dtoInstance)

      if (error) {
        return this.endRequest(400, error.errMsg, res)
      }

      next()
    }
  }

  public checkAuthToken = (req, res, next) => {
    if (!req?.headers.authorization) {
      return this.endRequest(401, "no auth token provided", res)
    }

    next()
  }

  private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
    return res.status(status).send({ message })
  }


}
