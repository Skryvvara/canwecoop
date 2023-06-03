export type User = {
  id: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
  friends: User[];
  createdAt: Date;
  lastLoggedIn: Date;
};

export type Role = {
  id: string;
  name: string;
};
