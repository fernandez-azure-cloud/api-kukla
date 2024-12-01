import { Entity } from 'typeorm';
import { Notification } from './notification.entity';

@Entity()
export class UserNotification extends Notification {}
