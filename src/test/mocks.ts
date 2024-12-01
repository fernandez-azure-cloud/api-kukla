import { NotificationService } from 'src/shared/services';

export const notificationServiceMock = {
  notify: () => {},
};
export const notificationServiceMockProvider = {
  provide: NotificationService,
  useValue: notificationServiceMock,
};
