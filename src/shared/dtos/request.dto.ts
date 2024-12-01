import { User } from '../entities';

export class RequestDto extends Request {
  user: User;
}
