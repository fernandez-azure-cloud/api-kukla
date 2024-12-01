import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplateVersion } from '../entities';
import { NotificationType } from '../base';

@Injectable()
export class EmailRepository {
  constructor(
    @InjectRepository(EmailTemplateVersion)
    private readonly templateVersionRepository: Repository<EmailTemplateVersion>,
  ) {}

  getCurrentVersion(
    emailTemplateCode: NotificationType,
  ): Promise<EmailTemplateVersion> {
    return this.templateVersionRepository.findOne({
      where: {
        emailTemplate: {
          code: emailTemplateCode,
        },
      },
      order: {
        version: 'DESC',
      },
    });
  }
}
