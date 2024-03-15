export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface ExistingUserDto {
  email: string;
  password: string;
}
