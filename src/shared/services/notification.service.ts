import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailTemplateVersion, Notification } from '../entities';
import { SMTP_OPTIONS } from '../tokens';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailRepository, NotificationRepository } from '../repositories';
import Handlebars from 'handlebars';
import { NotificationStatus } from '../base';

@Injectable()
export class NotificationService {
  transporter = nodemailer.createTransport(this.smtpOptions);
  private templateOptions = {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  };

  constructor(
    @Inject(SMTP_OPTIONS) private readonly smtpOptions: SMTPTransport.Options,
    private readonly emailRepository: EmailRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async notify(notification: Notification): Promise<any> {
    const template = await this.emailRepository.getCurrentVersion(
      notification.type,
    );
    notification.emailTemplateVersion = template;
    this.compileTemplate(notification, template);
    notification.status = NotificationStatus.Pending;
    notification =
      await this.notificationRepository.saveNotification(notification);

    try {
      const info = await this.transporter.sendMail({
        from: `"Kukla" <${this.smtpOptions.auth.user}>`,
        to: notification.user.email,
        subject: notification.subject,
        text: notification.text,
        html: notification.html,
      });
      notification.status = NotificationStatus.Sended;
      await this.notificationRepository.setNotificationStatus(notification);
      return info;
    } catch (error) {
      notification.status = NotificationStatus.Fail;
      await this.notificationRepository.setNotificationStatus(notification);
    }

    return;
  }

  compileTemplate(
    notification: Notification,
    template: EmailTemplateVersion,
  ): void {
    Handlebars.registerHelper('currency', (amount, options) => {
      const code = options.hash?.code ?? 'USD';
      const formatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: code,
      });
      return formatter.format(amount);
    });

    notification.subject = Handlebars.compile(template.subject)(
      notification,
      this.templateOptions,
    );
    notification.text = Handlebars.compile(template.text)(
      notification,
      this.templateOptions,
    );
    notification.html = Handlebars.compile(template.html)(
      notification,
      this.templateOptions,
    );
  }
}
