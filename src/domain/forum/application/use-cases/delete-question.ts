import { Either, left, right } from '../../../../core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '../../../../core/Errors/error/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/Errors/error/resource-not-found-error'

interface DeleteQuestionUseCasRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCasRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) return left(new ResourceNotFoundError())

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError())

    await this.questionsRepository.delete(question)

    return right({})
  }
}
