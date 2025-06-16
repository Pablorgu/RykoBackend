import { UserType } from 'src/user/userType.enum';
export class RegisterLocalDto {
  email: string;
  username: string;
  password: string;
  userType: UserType
}
