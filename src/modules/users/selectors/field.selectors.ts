import { Injectable } from '@nestjs/common';

@Injectable()
export class FieldSelectorService {
  selectFieldsForUser(): string[] {
    return ['name','lastName','phone', 'email', 'status', 'createdAt'];
  }

  selectFieldsForRole(): string[] {
    return ['id', 'description'];
  }
}
