import { Injectable } from '@nestjs/common';

@Injectable()
export class FieldSelectorService {
  selectFieldsForUser(): string[] {
    return ['id','code','description', 'status'];
  }
}
