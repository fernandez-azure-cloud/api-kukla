import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationStatus } from 'src/shared/base';
import {
  EmailTemplateVersion,
  Project,
  SendProjectNotification,
  User,
} from 'src/shared/entities';
import { NotificationRepository } from 'src/shared/repositories';
import { testDataSeed } from 'src/test/data-seed';
import { TypeOrmTestingModule } from 'src/test/type-orm-testing.module';
import { EntityManager } from 'typeorm';

describe('NotificationRepository', () => {
  let notificationRepository: NotificationRepository;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmTestingModule,
        TypeOrmModule.forFeature([SendProjectNotification]),
      ],
      providers: [NotificationRepository],
    }).compile();
    entityManager = moduleRef.get<EntityManager>(EntityManager);
    await testDataSeed(entityManager);
    notificationRepository = moduleRef.get<NotificationRepository>(
      NotificationRepository,
    );
  });

  it('should insert new notification', async () => {
    const notification = new SendProjectNotification();
    notification.emailTemplateVersion = {
      emailTemplateId: 1,
      version: 1,
    } as EmailTemplateVersion;
    notification.project = { id: 1 } as Project;
    notification.user = { id: 1 } as User;
    notification.status = NotificationStatus.Pending;
    const res = await notificationRepository.saveNotification(notification);
    expect(res.id).toBe(1);
  });

  it('should update status notification', async () => {
    const notification = new SendProjectNotification();
    notification.emailTemplateVersion = {
      emailTemplateId: 1,
      version: 1,
    } as EmailTemplateVersion;
    notification.project = { id: 1 } as Project;
    notification.user = { id: 1 } as User;
    notification.status = NotificationStatus.Pending;
    await notificationRepository.saveNotification(notification);
    notification.status = NotificationStatus.Sended;
    const res =
      await notificationRepository.setNotificationStatus(notification);
    expect(res.status).toBe(NotificationStatus.Sended);
  });
});
