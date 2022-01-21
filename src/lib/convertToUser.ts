import { User } from '@prisma/client';

export function convertToUser(props: any): User {
  try {
    let user: User = {
      id: props.id,
      displayName: props.displayName,
      avatar: props._json.avatar,
      avatarmedium: props._json.avatarmedium,
      avatarfull: props._json.avatarfull,
      profileurl: props._json.profileurl
    };
    return user;
  } catch(error: any) {
    throw error;
  }
}