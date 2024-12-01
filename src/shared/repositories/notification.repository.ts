import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification, SendProjectNotification } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(SendProjectNotification)
    private readonly sendProjectNotificationrepository: Repository<SendProjectNotification>,
  ) {}

  saveNotification(notification: Notification): Promise<Notification> {
    if (notification instanceof SendProjectNotification) {
      return this.sendProjectNotificationrepository.save(notification);
    }

    throw 'not implemented';
  }

  async setNotificationStatus(
    notification: Notification,
  ): Promise<Notification> {
    if (notification instanceof SendProjectNotification) {
      const value = await this.sendProjectNotificationrepository.findOne({
        where: { id: notification.id },
      });
      value.status = notification.status;
      return this.sendProjectNotificationrepository.save(value);
    }

    throw 'not implemented';
  }
}
