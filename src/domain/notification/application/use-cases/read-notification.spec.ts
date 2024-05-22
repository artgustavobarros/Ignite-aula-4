import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryNotificationsRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from '../../../../../test/factories/make-notification'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/Errors/error/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('shoud be able to read a notification', async () => {
    const notificaton = makeNotification()

    await inMemoryNotificationsRepository.create(notificaton)

    const result = await sut.execute({
      recipientId: notificaton.recipientId.toString(),
      notificationId: notificaton.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('shoud not be able to read a notification fro another user', async () => {
    const notificaton = makeNotification({
      recipientId: new UniqueEntityId('1'),
    })

    await inMemoryNotificationsRepository.create(notificaton)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notificaton.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
