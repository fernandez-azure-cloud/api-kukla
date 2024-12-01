import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SUCCESS_SAVE_MESSAGE } from 'src/shared/base';
import { Response, User } from 'src/shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectResponsesRepository {
  constructor(
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
  ) {}

  async saveResponses(responses: Response[]): Promise<string> {
    await this.responseRepository.save(responses);
    return Promise.resolve(SUCCESS_SAVE_MESSAGE);
  }

  async inactiveResponses(projectId: number, user: User): Promise<void> {
    const oldResponses = await this.responseRepository.find({
      where: {
        projectAssignment: {
          projectId: projectId,
        },
        active: true,
      },
    });

    oldResponses.forEach((r) => {
      r.active = false;
      r.updatedBy = user;
    });

    await this.responseRepository.save(oldResponses);
    return Promise.resolve(undefined);
  }
}
