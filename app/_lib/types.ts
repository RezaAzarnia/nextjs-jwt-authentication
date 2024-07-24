export type User = {
  username: string;
  email: string;
  password: string;
  confirm: string;
};
export type LoginUser = {
  email: string;
  password: string;
};

export interface RegisterdUser extends User {
  accessToken: string;
  createAt: Date;
}
