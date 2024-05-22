import { UseCaseError } from '../../../../../core/Errors/use-case-errors'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found.')
  }
}
