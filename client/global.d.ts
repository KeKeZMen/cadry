declare interface IUser {
  id: string;
  role: string;
  email: string;
}

declare interface IAuthResponse {
  user: IUser;
  accessToken: string;
}
