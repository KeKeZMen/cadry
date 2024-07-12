declare interface IUser {
  id: string;
  email: string;
  role: string;
}

declare interface IAuthResponse {
  user: IUser;
  accessToken: string;
}
