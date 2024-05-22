import { describe, expect, it, vi } from 'vitest'
import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggragate: CustomAggregate) {
    this.aggregate = aggragate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const customAggregate = new CustomAggregate(null)

    customAggregate.addDomainEvent(new CustomAggregateCreated(customAggregate))

    return customAggregate
  }
}

describe('domain events', () => {
  it('should be able to dispach and listen to events', () => {
    const callbackSpy = vi.fn()

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
