import { Either, left, right } from '../../../../core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '../../../../core/Errors/error/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/Errors/error/resource-not-found-error'

interface DeleteAnswerUseCasRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswerUseCase {
  constructor(private AnswersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCasRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    if (authorId !== answer.authorId.toString())
      return left(new NotAllowedError())

    await this.AnswersRepository.delete(answer)

    return right({})
  }
}
