export type User = {
  id: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
  Friends: User[];
  CreatedAt: Date;
  LastLoggedIn: Date;
};

export type Role = {
  id: string;
  name: string;
};
