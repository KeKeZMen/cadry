declare interface IUser {
  id: string;
  role: string;
}

declare interface IAuthResponse {
  user: IUser;
  accessToken: string;
}
