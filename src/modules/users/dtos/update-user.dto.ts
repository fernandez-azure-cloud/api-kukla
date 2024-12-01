export class UpdateUserDto {
  readonly name: string;
  readonly firstSurname: string;
  readonly lastSurname: string;
  readonly phone: string;
  readonly email: string;
  readonly password: string;
  readonly roles: number[];
}
