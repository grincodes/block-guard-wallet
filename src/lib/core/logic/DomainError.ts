import { Result } from "./Result"
import { UseCaseError } from "./UseCaseError"

export class DomainError extends Result<UseCaseError> {
  public constructor(msg: string, err?: any) {
    super(false, {
      message: msg,
      // error: err,
    } as UseCaseError)
    console.log(`[DomainError]: An unexpected error occurred`)
    console.error(err)
  }

  public static create(err: any): DomainError {
    return new DomainError(err)
  }
}
