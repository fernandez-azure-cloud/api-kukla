export class CreateUserDto {
  readonly name: string;
  readonly phone: string;
  readonly firstSurname: string;
  readonly lastSurname: string;
  readonly email: string;
  readonly password: string;
  readonly roles: number[];
}
