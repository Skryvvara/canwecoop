import styles from "@/styles/components/friendGrid.module.scss";
import { Game, User } from "@/types";
import { FriendCard } from "./friendCard";

interface IFriendGridProps {
  friends: User[];
}

export function FriendGrid(props: IFriendGridProps) {
  return (
    <ul className={styles.gameGrid}>
      {props.friends.map((friend: User, index: number) => (
        <FriendCard key={friend.id} friend={friend} index={index} />
      ))}
    </ul>
  );
}
