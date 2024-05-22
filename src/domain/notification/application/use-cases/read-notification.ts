import { NotAllowedError } from '../../../../core/Errors/error/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/Errors/error/resource-not-found-error'
import { Either, left, right } from '../../../../core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface ReadNotificationUseCasRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCasRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) return left(new ResourceNotFoundError())

    if (recipientId !== notification.recipientId.toString())
      return left(new NotAllowedError())

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
