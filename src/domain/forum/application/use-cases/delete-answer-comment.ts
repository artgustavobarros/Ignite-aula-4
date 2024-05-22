import { Either, left, right } from '../../../../core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowedError } from '../../../../core/Errors/error/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/Errors/error/resource-not-found-error'

interface DeleteAnswerCommentUseCasRequest {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCasRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) return left(new ResourceNotFoundError())

    if (answerComment.authorId.toString() !== authorId)
      return left(new NotAllowedError())

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
