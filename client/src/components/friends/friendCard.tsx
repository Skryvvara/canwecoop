import styles from "@/styles/components/friendCard.module.scss";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "react-feather";

interface props {
  friend: User;
  index?: number;
}

export function FriendCard(props: props) {
  const friend = props.friend;
  const index = props.index ?? 12;

  return (
    <li className={styles.card}>
      <header className={styles.cardHeader}>
        <Image
          src={friend.avatarUrl}
          alt={friend.displayName}
          width={240}
          height={240}
          priority={index && index <= 12 ? true : false}
        />
      </header>
      <div className={styles.cardBody}>
        <h2>{friend.displayName}</h2>
      </div>
      <footer className={styles.cardFooter}>
        <Link
          role="button"
          rel="noreferrer"
          target="_BLANK"
          href={friend.profileUrl}
          className="iconLink"
        >
          Profile <ExternalLink />
        </Link>
      </footer>
    </li>
  );
}
