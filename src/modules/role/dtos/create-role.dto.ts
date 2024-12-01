export class CreateRoleDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly roles: number[];
}
