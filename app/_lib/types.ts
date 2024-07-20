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

export type RegisterdUser = {
  username: string;
  email: string;
  password: string;
  createAt: Date;
};
