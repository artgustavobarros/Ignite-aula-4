import { UseCaseError } from '../../../../../core/Errors/use-case-errors'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed.')
  }
}
